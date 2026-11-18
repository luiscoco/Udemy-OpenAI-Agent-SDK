import { products } from "../public/lesson.js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const fixtureDirectory = fileURLToPath(
  new URL("../fixtures/robotics-club/", import.meta.url),
);

export function lookupOrder(orderId) {
  if (orderId !== "1042")
    throw new Error("The classroom dataset contains order 1042 only.");
  return {
    orderId,
    item: "Robotics starter kit",
    status: "Dispatched",
    delivery: "Next school day",
  };
}

export async function createDemo(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) throw new Error("Unknown product.");
  let result;
  if (productId === "agents-sdk") {
    const order = lookupOrder("1042");
    result = {
      text: `Order ${order.orderId} contains a ${order.item.toLowerCase()}. It has been ${order.status.toLowerCase()} and is expected on the next school day.`,
      evidence: JSON.stringify(order, null, 2),
      evidenceTitle: "Local tool data",
    };
  } else if (productId === "responses") {
    result = {
      text: "An AI agent uses a model to decide what to do next and can use tools to complete a task.",
      evidence: "response.output_text",
      evidenceTitle: "Response field",
    };
  } else if (productId === "agents-api") {
    result = {
      text: "In this simulation, the managed agent creates hello.py, executes it, and reports “Hello, classroom!”.",
      evidence:
        'hello.py\n\nprint("Hello, classroom!")\n\nIllustrative stdout\nHello, classroom!',
      evidenceTitle: "Illustrative hosted artifact",
      sessionId: "simulated-session-001",
    };
  } else {
    const source = await readFile(
      new URL("../fixtures/robotics-club/src/fees.mjs", import.meta.url),
      "utf8",
    );
    result = {
      text: "This project calculates robotics-club membership fees. src/fees.mjs implements the calculation, tests/fees.test.mjs checks the standard fee and sibling discount, and package.json exposes npm test.",
      evidence: source.trim(),
      evidenceTitle: "Actual local fixture file",
    };
  }
  return { steps: product.steps, result, mode: "demo", simulated: true };
}
