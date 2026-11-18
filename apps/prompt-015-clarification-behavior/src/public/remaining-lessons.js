export const remainingControls = {
  95: [
    {
      key: "scenario",
      label: "Conditional handoffs scenario",
      options: [
        ["authorized", "authorized"],
        ["disabled", "disabled"],
      ],
    },
  ],
  96: [
    {
      key: "scenario",
      label: "Next-turn ownership scenario",
      options: [
        ["last-specialist", "last specialist"],
        ["restart-triage", "restart triage"],
      ],
    },
  ],
  97: [
    {
      key: "scenario",
      label: "Manager and specialists scenario",
      options: [
        ["combine", "combine"],
        ["one-specialist", "one specialist"],
      ],
    },
  ],
  98: [
    {
      key: "scenario",
      label: "Specialist contracts scenario",
      options: [
        ["valid", "valid"],
        ["invalid", "invalid"],
      ],
    },
  ],
  99: [
    {
      key: "scenario",
      label: "Sequential workflow scenario",
      options: [
        ["valid-contracts", "valid contracts"],
        ["reject-invalid", "reject invalid"],
      ],
    },
  ],
  100: [
    {
      key: "scenario",
      label: "Parallel workflow scenario",
      options: [
        ["all-success", "all success"],
        ["partial-failure", "partial failure"],
      ],
    },
  ],
  101: [
    {
      key: "scenario",
      label: "Deterministic routing scenario",
      options: [
        ["known-rule", "known rule"],
        ["model-fallback", "model fallback"],
      ],
    },
  ],
  102: [
    {
      key: "scenario",
      label: "Planner and executor scenario",
      options: [
        ["execute-plan", "execute plan"],
        ["reject-plan", "reject plan"],
      ],
    },
  ],
  103: [
    {
      key: "scenario",
      label: "Evaluator and optimizer scenario",
      options: [
        ["converge", "converge"],
        ["iteration-limit", "iteration limit"],
      ],
    },
  ],
  104: [
    {
      key: "scenario",
      label: "State machine scenario",
      options: [
        ["complete", "complete"],
        ["recover", "recover"],
      ],
    },
  ],
  105: [
    {
      key: "scenario",
      label: "SDK session scenario",
      options: [
        ["same-session", "same session"],
        ["new-session", "new session"],
      ],
    },
  ],
  106: [
    {
      key: "scenario",
      label: "Persistent storage scenario",
      options: [
        ["restart-persistent", "restart persistent"],
        ["new-memory", "new memory"],
      ],
    },
  ],
  107: [
    {
      key: "scenario",
      label: "Session operations scenario",
      options: [
        ["correct", "correct"],
        ["clear", "clear"],
      ],
    },
  ],
  108: [
    {
      key: "scenario",
      label: "Custom session backend scenario",
      options: [
        ["concurrent-appends", "concurrent appends"],
        ["tenant-isolation", "tenant isolation"],
      ],
    },
  ],
  109: [
    {
      key: "scenario",
      label: "Server-managed continuation scenario",
      options: [
        ["conversation", "conversation"],
        ["response-chain", "response chain"],
        ["combined-settings", "combined settings"],
      ],
    },
  ],
  110: [
    {
      key: "scenario",
      label: "Context compaction scenario",
      options: [
        ["compact-context", "compact context"],
        ["full-context", "full context"],
      ],
    },
  ],
  111: [
    {
      key: "scenario",
      label: "Long-term application memory scenario",
      options: [
        ["approved-fact", "approved fact"],
        ["correct-fact", "correct fact"],
        ["delete-fact", "delete fact"],
        ["unapproved", "unapproved"],
      ],
    },
  ],
  112: [
    {
      key: "scenario",
      label: "History selection scenario",
      options: [
        ["retain-pairs", "retain pairs"],
        ["remove-pairs", "remove pairs"],
      ],
    },
  ],
  113: [
    {
      key: "scenario",
      label: "Input guardrail scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  114: [
    {
      key: "scenario",
      label: "Output guardrail scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  115: [
    {
      key: "scenario",
      label: "Tool-input guardrail scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  116: [
    {
      key: "scenario",
      label: "Tool-output guardrail scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  117: [
    {
      key: "scenario",
      label: "Model-based guardrail scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  118: [
    {
      key: "scenario",
      label: "Parallel versus blocking scenario",
      options: [
        ["parallel-blocked", "parallel blocked"],
        ["blocking-blocked", "blocking blocked"],
      ],
    },
  ],
  119: [
    {
      key: "scenario",
      label: "Guardrail scope scenario",
      options: [
        ["handoff", "handoff"],
        ["nested-tool", "nested tool"],
      ],
    },
  ],
  120: [
    {
      key: "scenario",
      label: "Streaming validation scenario",
      options: [
        ["accepted", "accepted"],
        ["rejected", "rejected"],
      ],
    },
  ],
  121: [
    {
      key: "scenario",
      label: "Approval-required tool scenario",
      options: [
        ["approve", "approve"],
        ["pause", "pause"],
      ],
    },
  ],
  122: [
    {
      key: "scenario",
      label: "Conditional approval scenario",
      options: [
        ["low-risk", "low risk"],
        ["high-risk", "high risk"],
      ],
    },
  ],
  123: [
    {
      key: "scenario",
      label: "Approve or reject scenario",
      options: [
        ["approve", "approve"],
        ["reject", "reject"],
      ],
    },
  ],
  124: [
    {
      key: "scenario",
      label: "Persisted pause scenario",
      options: [
        ["restore-process", "restore process"],
        ["pause", "pause"],
      ],
    },
  ],
  125: [
    {
      key: "scenario",
      label: "Nested approvals scenario",
      options: [
        ["nested-tool", "nested tool"],
        ["handoff", "handoff"],
      ],
    },
  ],
  126: [
    {
      key: "scenario",
      label: "Multiple pending actions scenario",
      options: [
        ["approve-both", "approve both"],
        ["mixed-decisions", "mixed decisions"],
      ],
    },
  ],
  127: [
    {
      key: "scenario",
      label: "Review interface scenario",
      options: [
        ["pause", "pause"],
        ["approve", "approve"],
        ["reject", "reject"],
      ],
    },
  ],
  128: [
    {
      key: "scenario",
      label: "Safe resumption scenario",
      options: [
        ["valid-on-resume", "valid on resume"],
        ["revoked", "revoked"],
        ["duplicate-resume", "duplicate resume"],
      ],
    },
  ],
  129: [
    {
      key: "scenario",
      label: "First sandbox agent scenario",
      options: [
        ["input-output", "input output"],
        ["read-only", "read only"],
      ],
    },
  ],
  130: [
    {
      key: "scenario",
      label: "Workspace manifest scenario",
      options: [
        ["full-manifest", "full manifest"],
        ["minimal-manifest", "minimal manifest"],
      ],
    },
  ],
  131: [
    {
      key: "scenario",
      label: "Sandbox providers scenario",
      options: [
        ["portable", "portable"],
        ["docker-contract", "docker contract"],
        ["hosted-contract", "hosted contract"],
      ],
    },
  ],
  132: [
    {
      key: "scenario",
      label: "Repository workspace scenario",
      options: [
        ["repository", "repository"],
        ["instructions", "instructions"],
      ],
    },
  ],
  133: [
    {
      key: "scenario",
      label: "Storage mounts scenario",
      options: [
        ["same-tenant", "same tenant"],
        ["other-tenant", "other tenant"],
      ],
    },
  ],
  134: [
    {
      key: "scenario",
      label: "Runtime boundaries scenario",
      options: [
        ["allowed", "allowed"],
        ["denied", "denied"],
      ],
    },
  ],
  135: [
    {
      key: "scenario",
      label: "Artifacts and previews scenario",
      options: [
        ["artifact", "artifact"],
        ["preview", "preview"],
      ],
    },
  ],
  136: [
    {
      key: "scenario",
      label: "State and snapshots scenario",
      options: [
        ["reuse", "reuse"],
        ["snapshot", "snapshot"],
        ["run-state", "run state"],
      ],
    },
  ],
  137: [
    {
      key: "scenario",
      label: "Shell capability scenario",
      options: [
        ["success", "success"],
        ["failure", "failure"],
        ["interactive-capability", "interactive capability"],
      ],
    },
  ],
  138: [
    {
      key: "scenario",
      label: "Filesystem capability scenario",
      options: [
        ["patch", "patch"],
        ["image", "image"],
      ],
    },
  ],
  139: [
    {
      key: "scenario",
      label: "Reusable skills scenario",
      options: [
        ["run-skill", "run skill"],
        ["inspect-skill", "inspect skill"],
      ],
    },
  ],
  140: [
    {
      key: "scenario",
      label: "Skill discovery scenario",
      options: [
        ["eager", "eager"],
        ["lazy", "lazy"],
      ],
    },
  ],
  141: [
    {
      key: "scenario",
      label: "Sandbox memory scenario",
      options: [
        ["read-memory", "read memory"],
        ["disabled", "disabled"],
      ],
    },
  ],
  142: [
    {
      key: "scenario",
      label: "Sandbox compaction scenario",
      options: [
        ["compact", "compact"],
        ["full", "full"],
      ],
    },
  ],
  143: [
    {
      key: "scenario",
      label: "Custom capabilities scenario",
      options: [
        ["allowed", "allowed"],
        ["denied", "denied"],
      ],
    },
  ],
  144: [
    {
      key: "scenario",
      label: "Capability configuration scenario",
      options: [
        ["dependencies", "dependencies"],
        ["cleanup", "cleanup"],
      ],
    },
  ],
  145: [
    {
      key: "scenario",
      label: "First trace scenario",
      options: [
        ["trace", "trace"],
        ["inspect", "inspect"],
      ],
    },
  ],
  146: [
    {
      key: "scenario",
      label: "Workflow grouping scenario",
      options: [
        ["grouped", "grouped"],
        ["inspect", "inspect"],
      ],
    },
  ],
  147: [
    {
      key: "scenario",
      label: "Custom spans scenario",
      options: [
        ["custom-span", "custom span"],
        ["inspect", "inspect"],
      ],
    },
  ],
  148: [
    {
      key: "scenario",
      label: "Run hooks scenario",
      options: [
        ["run-hooks", "run hooks"],
        ["inspect", "inspect"],
      ],
    },
  ],
  149: [
    {
      key: "scenario",
      label: "Agent hooks scenario",
      options: [
        ["agent-hooks", "agent hooks"],
        ["inspect", "inspect"],
      ],
    },
  ],
  150: [
    {
      key: "scenario",
      label: "Trace controls scenario",
      options: [
        ["redact", "redact"],
        ["include-fixture", "include fixture"],
      ],
    },
  ],
  151: [
    {
      key: "scenario",
      label: "Operational metrics scenario",
      options: [
        ["metrics", "metrics"],
        ["estimate", "estimate"],
      ],
    },
  ],
  152: [
    {
      key: "scenario",
      label: "Workflow visualization scenario",
      options: [
        ["graph", "graph"],
        ["export", "export"],
      ],
    },
  ],
  153: [
    {
      key: "scenario",
      label: "Browser voice agent scenario",
      options: [
        ["connect", "connect"],
        ["permission-denied", "permission denied"],
      ],
    },
  ],
  154: [
    {
      key: "scenario",
      label: "Server voice connection scenario",
      options: [
        ["websocket", "websocket"],
        ["disconnect", "disconnect"],
      ],
    },
  ],
  155: [
    {
      key: "scenario",
      label: "Turn detection scenario",
      options: [
        ["server-vad", "server vad"],
        ["semantic-vad", "semantic vad"],
        ["manual-commit", "manual commit"],
      ],
    },
  ],
  156: [
    {
      key: "scenario",
      label: "Interruptions scenario",
      options: [
        ["interrupt", "interrupt"],
        ["complete", "complete"],
      ],
    },
  ],
  157: [
    {
      key: "scenario",
      label: "Realtime tools scenario",
      options: [
        ["authorized", "authorized"],
        ["forbidden", "forbidden"],
      ],
    },
  ],
  158: [
    {
      key: "scenario",
      label: "Voice handoffs scenario",
      options: [
        ["handoff", "handoff"],
        ["stay", "stay"],
      ],
    },
  ],
  159: [
    {
      key: "scenario",
      label: "Realtime events scenario",
      options: [
        ["events", "events"],
        ["failure", "failure"],
      ],
    },
  ],
  160: [
    {
      key: "scenario",
      label: "Voice controls scenario",
      options: [
        ["approve", "approve"],
        ["reject", "reject"],
        ["guardrail-blocked", "guardrail blocked"],
      ],
    },
  ],
  161: [
    {
      key: "scenario",
      label: "Python voice pipeline scenario",
      options: [
        ["complete", "complete"],
        ["failure", "failure"],
      ],
    },
  ],
  162: [
    {
      key: "scenario",
      label: "Streaming audio input scenario",
      options: [
        ["chunks", "chunks"],
        ["complete", "complete"],
      ],
    },
  ],
  163: [
    {
      key: "scenario",
      label: "Speech recognition scenario",
      options: [
        ["english", "english"],
        ["spanish", "spanish"],
      ],
    },
  ],
  164: [
    {
      key: "scenario",
      label: "Speech generation scenario",
      options: [
        ["normal", "normal"],
        ["fast", "fast"],
      ],
    },
  ],
  165: [
    {
      key: "scenario",
      label: "Custom voice workflow scenario",
      options: [
        ["support", "support"],
        ["billing", "billing"],
      ],
    },
  ],
  166: [
    {
      key: "scenario",
      label: "GPT-Live integration scenario",
      options: [
        ["delegate", "delegate"],
        ["reject-tool", "reject tool"],
      ],
    },
  ],
  167: [
    {
      key: "scenario",
      label: "Server-side control scenario",
      options: [
        ["duplicate", "duplicate"],
        ["revoked", "revoked"],
      ],
    },
  ],
  168: [
    {
      key: "scenario",
      label: "Telephony integration scenario",
      options: [
        ["media-stop", "media stop"],
        ["disconnect", "disconnect"],
      ],
    },
  ],
  169: [
    {
      key: "scenario",
      label: "Deterministic model tests scenario",
      options: [
        ["pass", "pass"],
        ["extra-call", "extra call"],
      ],
    },
  ],
  170: [
    {
      key: "scenario",
      label: "Tool unit tests scenario",
      options: [
        ["valid", "valid"],
        ["invalid", "invalid"],
      ],
    },
  ],
  171: [
    {
      key: "scenario",
      label: "Routing tests scenario",
      options: [
        ["billing", "billing"],
        ["technical", "technical"],
      ],
    },
  ],
  172: [
    {
      key: "scenario",
      label: "Approval tests scenario",
      options: [
        ["approved", "approved"],
        ["rejected", "rejected"],
      ],
    },
  ],
  173: [
    {
      key: "scenario",
      label: "Streaming and runtime tests scenario",
      options: [
        ["sandbox", "sandbox"],
        ["realtime", "realtime"],
        ["guardrail", "guardrail"],
      ],
    },
  ],
  174: [
    {
      key: "scenario",
      label: "Evaluation dataset scenario",
      options: [
        ["baseline", "baseline"],
        ["regression", "regression"],
      ],
    },
  ],
  175: [
    {
      key: "scenario",
      label: "Trace evaluation scenario",
      options: [
        ["passing-trace", "passing trace"],
        ["failing-trace", "failing trace"],
      ],
    },
  ],
  176: [
    {
      key: "scenario",
      label: "Regression comparison scenario",
      options: [
        ["v1", "v1"],
        ["v2", "v2"],
      ],
    },
  ],
  177: [
    {
      key: "scenario",
      label: "Retry policy scenario",
      options: [
        ["recover", "recover"],
        ["permanent-failure", "permanent failure"],
      ],
    },
  ],
  178: [
    {
      key: "scenario",
      label: "Timeout policy scenario",
      options: [
        ["complete", "complete"],
        ["deadline", "deadline"],
        ["model-deadline", "model deadline"],
        ["tool-deadline", "tool deadline"],
      ],
    },
  ],
  179: [
    {
      key: "scenario",
      label: "Execution budgets scenario",
      options: [
        ["within-budget", "within budget"],
        ["exhausted", "exhausted"],
      ],
    },
  ],
  180: [
    {
      key: "scenario",
      label: "Background jobs scenario",
      options: [
        ["complete-job", "complete job"],
        ["retry-job", "retry job"],
      ],
    },
  ],
  181: [
    {
      key: "scenario",
      label: "Authenticated API scenario",
      options: [
        ["authorized", "authorized"],
        ["unauthorized", "unauthorized"],
        ["other-tenant", "other tenant"],
      ],
    },
  ],
  182: [
    {
      key: "scenario",
      label: "Application frontend scenario",
      options: [
        ["conversation", "conversation"],
        ["new-session", "new session"],
      ],
    },
  ],
  183: [
    {
      key: "scenario",
      label: "Deployment scenario",
      options: [
        ["healthy", "healthy"],
        ["draining", "draining"],
      ],
    },
  ],
  184: [
    {
      key: "scenario",
      label: "Durable execution scenario",
      options: [
        ["recover-crash", "recover crash"],
        ["duplicate-delivery", "duplicate delivery"],
      ],
    },
  ],
  185: [
    {
      key: "scenario",
      label: "Encrypted sessions scenario",
      options: [
        ["decrypt", "decrypt"],
        ["tamper", "tamper"],
        ["retention", "retention"],
      ],
    },
  ],
  186: [
    {
      key: "scenario",
      label: "Conversation branches scenario",
      options: [
        ["fork", "fork"],
        ["compare", "compare"],
      ],
    },
  ],
  187: [
    {
      key: "scenario",
      label: "Provider adapters scenario",
      options: [
        ["compatible", "compatible"],
        ["unsupported", "unsupported"],
      ],
    },
  ],
  188: [
    {
      key: "scenario",
      label: "Decision-based routing scenario",
      options: [
        ["route", "route"],
        ["refusal", "refusal"],
      ],
    },
  ],
  189: [
    {
      key: "scenario",
      label: "Codex delegation scenario",
      options: [
        ["bounded-task", "bounded task"],
        ["reject-scope", "reject scope"],
      ],
    },
  ],
  190: [
    {
      key: "scenario",
      label: "Hosted subagents scenario",
      options: [
        ["availability", "availability"],
        ["fallback", "fallback"],
      ],
    },
  ],
  191: [
    {
      key: "scenario",
      label: "ChatKit interface scenario",
      options: [
        ["thread", "thread"],
        ["new-thread", "new thread"],
      ],
    },
  ],
  192: [
    {
      key: "scenario",
      label: "Release coverage audit scenario",
      options: [
        ["audit", "audit"],
        ["compatibility", "compatibility"],
      ],
    },
  ],
  193: [
    {
      key: "scenario",
      label: "Customer-support assistant scenario",
      options: [
        ["order", "order"],
        ["refund", "refund"],
        ["reject-refund", "reject refund"],
      ],
    },
  ],
  194: [
    {
      key: "scenario",
      label: "Knowledge assistant scenario",
      options: [
        ["grounded", "grounded"],
        ["no-evidence", "no evidence"],
        ["forbidden", "forbidden"],
      ],
    },
  ],
  195: [
    {
      key: "scenario",
      label: "Research assistant scenario",
      options: [
        ["complete", "complete"],
        ["partial-failure", "partial failure"],
      ],
    },
  ],
  196: [
    {
      key: "scenario",
      label: "Business-workflow assistant scenario",
      options: [
        ["approve", "approve"],
        ["reject", "reject"],
        ["duplicate", "duplicate"],
      ],
    },
  ],
  197: [
    {
      key: "scenario",
      label: "Data-analysis assistant scenario",
      options: [
        ["analyze", "analyze"],
        ["invalid-data", "invalid data"],
      ],
    },
  ],
  198: [
    {
      key: "scenario",
      label: "Coding assistant scenario",
      options: [
        ["fix", "fix"],
        ["failing-tests", "failing tests"],
      ],
    },
  ],
  199: [
    {
      key: "scenario",
      label: "Voice support application scenario",
      options: [
        ["interrupt", "interrupt"],
        ["tool-failure", "tool failure"],
      ],
    },
  ],
  200: [
    {
      key: "scenario",
      label: "Production capstone scenario",
      options: [
        ["healthy", "healthy"],
        ["recover", "recover"],
        ["regression", "regression"],
      ],
    },
  ],
};
export const remainingHints = {
  95: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  96: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  97: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  98: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  99: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  100: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  101: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  102: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  103: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  104: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  105: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  106: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  107: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  108: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  109: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  110: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  111: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  112: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  113: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  114: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  115: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  116: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  117: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  118: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  119: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  120: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  121: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  122: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  123: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  124: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  125: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  126: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  127: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  128: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  129: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  130: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  131: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  132: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  133: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  134: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  135: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  136: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  137: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  138: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  139: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  140: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  141: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  142: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  143: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  144: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  145: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  146: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  147: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  148: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  149: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  150: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  151: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  152: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  153: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  154: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  155: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  156: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  157: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  158: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  159: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  160: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  161: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  162: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  163: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  164: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  165: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  166: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  167: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  168: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  169: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  170: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  171: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  172: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  173: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  174: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  175: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  176: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  177: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  178: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  179: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  180: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  181: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  182: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  183: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  184: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  185: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  186: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  187: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  188: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  189: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  190: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  191: "Compare the scenarios, then expand the evidence. Provider behavior uses labeled fixtures. Companion integration code describes live setup.",
  192: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  193: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  194: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  195: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  196: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  197: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  198: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  199: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
  200: "Compare the scenarios, then expand the evidence. Classroom model decisions are deterministic. SDK calls and application operations execute locally.",
};
export function remainingPreview(number, input) {
  return JSON.stringify(
    {
      prompt: number,
      scenario: input.scenario ?? remainingControls[number][0].options[0][0],
      execution: "Local SDK and application exercise",
    },
    null,
    2,
  );
}
