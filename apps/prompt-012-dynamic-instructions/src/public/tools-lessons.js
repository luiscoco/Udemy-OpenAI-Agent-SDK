const control = (key, label, options) => ({ key, label, options });
export const toolsControls = {
  55: [
    control("approvalDecision", "Decision after the stream pauses", [
      ["pause", "Preserve paused state"],
      ["approve", "Restore and approve"],
      ["reject", "Restore and reject"],
    ]),
  ],
  56: [
    control("sseClient", "Teaching HTTP client", [
      ["complete", "Keep the SSE connection open"],
      ["disconnect", "Disconnect after three text chunks"],
    ]),
  ],
  57: [
    control("calculatorQuestion", "Question", [
      ["arithmetic", "Calculate 12.5 × 3"],
      ["concept", "Explain what a calculator tool does"],
    ]),
  ],
  58: [
    control("argumentCase", "Candidate tool arguments", [
      ["valid", "Valid workshop arguments"],
      ["wrong-type", "Participants supplied as text"],
      ["too-many", "Participant count exceeds the limit"],
      ["unknown-city", "City outside the enum"],
    ]),
  ],
  59: [
    control("descriptionQuality", "Tool definitions", [
      ["clear", "Specific names and descriptions"],
      ["vague", "Vague names and descriptions"],
    ]),
  ],
  60: [
    control("apiScenario", "HTTP API scenario", [
      ["success", "Authenticated request succeeds"],
      ["unauthorized", "API rejects the credential"],
      ["timeout", "API exceeds the request deadline"],
      ["server-error", "API returns a service error"],
    ]),
  ],
  61: [
    control("databaseProfile", "Application identity fixture", [
      ["alice", "Alice · tenant A"],
      ["ben", "Ben · tenant B"],
    ]),
    control("recordCase", "Record lookup", [
      ["own", "Own tenant record"],
      ["cross", "Another tenant record"],
      ["injection", "SQL injection-shaped record ID"],
    ]),
  ],
  62: [
    control("returnFormat", "Tool output format", [
      ["structured", "Schema-validated object"],
      ["text", "Descriptive text"],
    ]),
  ],
  63: [
    control("toolErrorPolicy", "Failure policy", [
      ["safe-result", "Return a safe model-visible failure"],
      ["propagate", "Propagate the SDK tool exception"],
    ]),
  ],
  64: [
    control("timeoutPolicy", "Tool timeout policy", [
      ["as-result", "Return a timeout result"],
      ["raise", "Raise ToolTimeoutError"],
      ["retry", "Explicitly retry the read-only operation once"],
    ]),
  ],
};
export const toolsHints = {
  55: "The actual streamed run pauses before the tool executes. It settles, serializes RunState, and optionally restores the same run to apply the selected approval decision.",
  56: "A teaching HTTP client connects to a real local SSE endpoint. The disconnect option closes that connection after three text chunks. Inspect server cancellation and awaited cleanup in the result.",
  57: "The calculator executes application arithmetic through a registered SDK tool. Classroom model selection is scripted. Live API lets your configured model decide whether to call it.",
  58: "Zod constrains city, integer participant count, and date format. Inspect whether invalid model arguments reach the tool callback and what the model receives afterward.",
  59: "Compare the actual tool definitions exposed to the model. Classroom selections illustrate a controlled ambiguity case. Live decisions can vary.",
  60: "The real asynchronous tool calls a separate loopback HTTP API with a bearer credential and deadline. Fixture credentials and weather data are synthetic. Errors expose public codes.",
  61: "This app uses real embedded SQLite with bound parameters and query_only enabled. The identity selector simulates authenticated server context. The model supplies only a record ID.",
  62: "Compare the actual tool output and next model input. The structured path validates a Zod output schema before downstream consumption.",
  63: "The tool throws an error containing a synthetic secret. The configured error handler returns an allowlisted failure, or the application catches ToolCallError and exposes a safe code.",
  64: "The SDK enforces timeoutMs and timeoutBehavior. The backend cooperates with details.signal. The retry scenario explicitly starts one additional application attempt after cleanup.",
};
export function toolsPreview(number, input) {
  if (number === 55)
    return "await stream.completed\nInspect interruptions → serialize state\nawait RunState.fromString(agent, snapshot)\nstate.approve(item) / state.reject(item)\nResume the same SDK run.";
  if (number === 56)
    return "GET /events → text/event-stream\nActual SDK events → HTTP client\nResponse close → AbortController.abort()\nAwait stream and model cleanup → close server.";
  if (number === 57)
    return 'calculate({operation: "multiply", left: 12.5, right: 3}) → 37.5\nA concept question can be answered directly.';
  if (number === 58)
    return "city: Madrid | Paris\nparticipants: integer from 1 through 20\ndate: YYYY-MM-DD\nThe SDK validates arguments before tool execution.";
  if (number === 59)
    return input.descriptionQuality === "vague"
      ? "handle_order / process_order\nBoth say: Handle an order."
      : "create_shipment: create a new shipment\nread_shipment_status: read an existing shipment’s delivery status\norderId: identifier of an existing order";
  if (number === 60)
    return "GET /weather?city=Madrid\nAuthorization: Bearer <server-owned credential>\nAbortSignal.timeout(...)\nMap HTTP, deadline, and network failures to public codes.";
  if (number === 61)
    return "SELECT id, title FROM workshops WHERE tenant_id = ? AND id = ?\nParameters: application tenant ID, model-supplied record ID\nSQLite PRAGMA query_only = ON";
  if (number === 62)
    return input.returnFormat === "text"
      ? "Robotics workshop lasts 30 minutes. Materials: kits, projector."
      : '{topic: "Robotics", durationMinutes: 30, materials: ["kits", "projector"]}';
  if (number === 63)
    return "errorFunction → safe failure object\nerrorFunction: null → SDK ToolCallError\nModel input and application evidence receive allowlisted diagnostics.";
  return "timeoutMs: 40\ntimeoutBehavior: error_as_result | raise_exception\nexecute(..., details) awaits work with details.signal\nApplication retry count is explicit and bounded.";
}
