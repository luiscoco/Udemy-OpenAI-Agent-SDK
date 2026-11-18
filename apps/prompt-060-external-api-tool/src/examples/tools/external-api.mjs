import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as pause } from "node:timers/promises";

export class ServiceError extends Error {
  constructor(code, status) {
    super(code);
    this.name = "ServiceError";
    this.code = code;
    this.status = status;
  }
}

export async function fetchWeather({
  baseURL,
  token,
  city,
  signal,
  timeoutMs = 1500,
}) {
  const url = new URL("/weather", baseURL);
  url.searchParams.set("city", city);
  const deadline = AbortSignal.timeout(timeoutMs);
  const requestSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: requestSignal,
    });
    if (!response.ok)
      throw new ServiceError(
        response.status === 401
          ? "AUTHENTICATION_FAILED"
          : "UPSTREAM_UNAVAILABLE",
        response.status,
      );
    let data;
    try {
      data = await response.json();
    } catch {
      throw new ServiceError("INVALID_API_RESPONSE", 502);
    }
    if (
      !data ||
      typeof data !== "object" ||
      typeof data.city !== "string" ||
      !Number.isFinite(data.temperatureC)
    )
      throw new ServiceError("INVALID_API_RESPONSE", 502);
    return { city: data.city, temperatureC: data.temperatureC };
  } catch (error) {
    signal?.throwIfAborted();
    if (deadline.aborted) throw new ServiceError("API_TIMEOUT", 504);
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("NETWORK_FAILURE", 502);
  }
}

export async function createWeatherFixture(scenario) {
  const requests = [];
  const active = new Set();
  const token = "classroom-weather-token";
  const server = createServer(async (request, response) => {
    const controller = new AbortController();
    active.add(controller);
    response.on("close", () => controller.abort());
    const authorized = request.headers.authorization === `Bearer ${token}`;
    requests.push({
      path: new URL(request.url, "http://localhost").pathname,
      authorizationPresent: Boolean(request.headers.authorization),
      authorized,
    });
    try {
      if (!authorized) {
        response.writeHead(401, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }
      if (scenario === "timeout")
        await pause(500, undefined, { signal: controller.signal });
      if (scenario === "server-error") {
        response.writeHead(503, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "private upstream diagnostic" }));
        return;
      }
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ city: "Madrid", temperatureC: 22 }));
    } catch (error) {
      if (!controller.signal.aborted) response.destroy(error);
    } finally {
      active.delete(controller);
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    baseURL: `http://127.0.0.1:${server.address().port}`,
    token,
    requests,
    async close() {
      for (const controller of active) controller.abort();
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
