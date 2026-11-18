export const classroomProfiles = {
  ada: {
    user: { id: "sample-user-a", displayName: "Ada" },
    tenant: { id: "school-a" },
  },
  luis: {
    user: { id: "sample-user-b", displayName: "Luis" },
    tenant: { id: "school-b" },
  },
};

export function makeContext(input = {}) {
  const profile = input.profile ?? "ada";
  if (!Object.hasOwn(classroomProfiles, profile))
    throw new Error("Choose a listed classroom profile.");
  return {
    ...structuredClone(classroomProfiles[profile]),
    preferences: {
      language: input.contextLanguage ?? "English",
      timezone: input.timezone ?? "Europe/Madrid",
      detail: input.detail ?? "brief",
    },
    request: { id: "classroom-request-001", source: "classroom" },
  };
}

const profile = {
  key: "profile",
  label: "Simulated authenticated profile",
  options: [
    ["ada", "Ada · School A"],
    ["luis", "Luis · School B"],
  ],
};
const language = {
  key: "contextLanguage",
  label: "Language",
  options: [
    ["English", "English"],
    ["Spanish", "Spanish"],
  ],
};
const timezone = {
  key: "timezone",
  label: "Timezone",
  options: [
    ["Europe/Madrid", "Europe/Madrid"],
    ["America/New_York", "America/New_York"],
  ],
};
export const contextControls = {
  17: [
    profile,
    {
      key: "contextCase",
      label: "Context payload",
      options: [
        ["valid", "Valid typed context"],
        ["missing-tenant", "Missing tenant"],
        ["invalid-language", "Invalid language"],
      ],
    },
  ],
  18: [profile],
  19: [
    {
      key: "visibility",
      label: "Model-visible channel",
      options: [
        ["local", "Keep data local"],
        ["instructions", "Include selected preferences in instructions"],
        ["tool", "Return selected information from a tool"],
      ],
    },
  ],
  20: [
    profile,
    {
      key: "documentId",
      label: "Model-requested document ID",
      options: [
        ["doc-a", "doc-a · School A fixture"],
        ["doc-b", "doc-b · School B fixture"],
        ["missing", "Unknown document"],
      ],
    },
  ],
  21: [
    language,
    timezone,
    {
      key: "detail",
      label: "Response detail",
      options: [
        ["brief", "Brief"],
        ["detailed", "Detailed"],
      ],
    },
  ],
  22: [
    {
      key: "contextPattern",
      label: "Context propagation",
      options: [
        ["handoff", "Handoff · same context"],
        ["nested-shared", "Nested call · explicit shared context"],
        ["nested-copy", "Nested call · copied context"],
      ],
    },
  ],
  23: [
    {
      key: "recordId",
      label: "Fixture tool argument",
      options: [
        ["record-a", "Record A"],
        ["record-b", "Record B"],
      ],
    },
  ],
  24: [
    {
      key: "lifecycleOutcome",
      label: "Lifecycle scenario",
      options: [
        ["success", "Successful run"],
        ["failure", "Tool operation fails"],
        ["cancel", "Cancellation during the tool"],
        ["init-failure", "Client initialization fails"],
      ],
    },
  ],
};

export const contextHints = {
  17: "Validate user, tenant, preferences, and request metadata with Zod. The executable TypeScript example supplies the SDK context type.",
  18: "The tool reuses database, API, and logging adapters supplied through context. All services here use in-memory teaching fixtures.",
  19: "Inspect the local model adapter's actual request snapshots. This exercise shows the exact instructions and tool output received by that adapter.",
  20: "A server-created classroom profile supplies the tenant. The tool checks it inside the data query for every requested identifier. These profiles simulate an authenticated application.",
  21: "Format the same workshop time using real Intl timezone conversion. Pass only selected preferences into model instructions.",
  22: "Use a real SDK handoff or nested runner call. Inspect which context object receives the specialist's note.",
  23: "Read call identity from the installed SDK's ToolCallDetails. The application logger records call ID, tool name, and argument names.",
  24: "Initialize owned client adapters, execute the SDK run, and clean up in finally. Failure and cancellation scenarios execute locally with in-memory adapters.",
};

export function contextCandidate(input) {
  const candidate = makeContext(input);
  const contextCase = input.contextCase ?? "valid";
  if (!["valid", "missing-tenant", "invalid-language"].includes(contextCase))
    throw new Error("Choose a listed context payload.");
  if (contextCase === "missing-tenant") delete candidate.tenant;
  if (contextCase === "invalid-language")
    candidate.preferences.language = "unsupported-language";
  return candidate;
}

export function contextPreview(number, input) {
  if (number === 17) return JSON.stringify(contextCandidate(input), null, 2);
  if ([18, 20, 21].includes(number))
    return JSON.stringify(makeContext(input), null, 2);
  if (number === 19)
    return "Compare local context with the SDK model request. Explicit instructions and tool results are channels to the model.";
  if (number === 22)
    return "A handoff continues with shared run context. A manual nested call receives the object passed in its context option. A copied object has separate mutable state.";
  if (number === 23)
    return "execute(arguments, runContext, details) receives ToolCallDetails. Use details.toolCall.callId and Object.keys(arguments) for safe application logs.";
  return "Initialize → await agent run → finally → close owned clients in reverse order. Inspect the actual lifecycle trace.";
}
