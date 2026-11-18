export const controlControls = {
  65: [
    {
      key: "toolChoice",
      label: "Tool selection policy",
      options: [
        ["auto", "Automatic selection"],
        ["required", "Require a tool"],
        ["read_capacity", "Force read_capacity"],
      ],
    },
  ],
  66: [
    {
      key: "stopPolicy",
      label: "After the function tool returns",
      options: [
        ["stop_on_first_tool", "Return its result directly"],
        ["run_llm_again", "Return to the model"],
        ["named", "Stop on read_workshop"],
      ],
    },
  ],
  67: [
    {
      key: "completionCase",
      label: "Workshop report",
      options: [
        ["complete", "Checklist complete"],
        ["needs-context", "Audience missing"],
      ],
    },
  ],
  68: [
    {
      key: "availabilityProfile",
      label: "Application permission fixture",
      options: [
        ["editor", "Editor with current permission"],
        ["viewer", "Viewer with editing hidden"],
        ["revoked", "Editor visible with permission revoked"],
      ],
    },
  ],
  69: [
    {
      key: "parallelPattern",
      label: "Model-side call pattern",
      options: [
        ["parallel", "Independent calls in one response"],
        ["sequential", "One call per response"],
      ],
    },
    {
      key: "concurrencyLimit",
      label: "Maximum local callbacks",
      options: [
        ["1", "One at a time"],
        ["2", "Up to two at a time"],
      ],
    },
  ],
  70: [
    {
      key: "resetPolicy",
      label: "Tool-choice reset behavior",
      options: [
        ["reset", "Reset after the first tool call"],
        ["bounded-loop", "Retain forced choice with a turn budget"],
      ],
    },
  ],
  71: [
    {
      key: "discoveryMode",
      label: "Definition loading",
      options: [
        ["deferred", "Hosted discovery with deferred tools"],
        ["eager", "All tool definitions available"],
      ],
    },
  ],
  72: [
    {
      key: "callerPolicy",
      label: "Read-tool eligibility",
      options: [
        ["programmatic-only", "Programmatic callers only"],
        ["direct-and-programmatic", "Direct and programmatic callers"],
      ],
    },
  ],
  73: [
    {
      key: "searchScope",
      label: "Search restriction",
      options: [
        ["official", "Allow developers.openai.com"],
        ["open", "Search without a domain filter"],
      ],
    },
  ],
  74: [
    {
      key: "documentQuestion",
      label: "Question for the document collection",
      options: [
        ["schedule", "Workshop time and room"],
        ["materials", "Required materials"],
      ],
    },
  ],
};
export const controlHints = {
  65: "Classroom model decisions are scripted. The actual SDK receives auto, required or a specific tool name. Inspect observed callbacks and tool-choice reset.",
  66: "Compare actual model-response counts and the returned output under stop_on_first_tool, run_llm_again and stopAtToolNames.",
  67: "The completion callback examines the actual structured report. Complete reports finish immediately. Incomplete reports return to the model.",
  68: "Profiles simulate application context. The revoked scenario exposes the edit capability while its implementation denies the change.",
  69: "Classroom call batches are scripted. Tool delays execute locally. Compare measured peak concurrency with the independent executor limit.",
  70: "A controlled model repeats the forced tool while that setting remains active. The reset scenario completes. The retained choice reaches a finite maxTurns budget.",
  71: "The installed SDK serializes hosted tool search, deferLoading and toolNamespace. Classroom discovery uses injected provider responses. Live mode performs hosted discovery.",
  72: "Live mode uses hosted generated JavaScript. Classroom mode injects a fixed program and child calls, then executes a fixed aggregation expression over actual callback rows. Only the read tool permits programmatic callers.",
  73: "Classroom search and citations are provider fixtures. Live mode performs hosted web search. Returned URL annotations become clickable sources below the answer.",
  74: "Classroom retrieval is a provider fixture. For live retrieval, run setup:documents from this app folder, put its vector-store ID in the app .env, then restart. Uploaded documents live in an OpenAI-hosted vector store.",
};
const previews = {
  65: "modelSettings: { toolChoice: auto | required | read_capacity }\nresetToolChoice: true",
  66: "toolUseBehavior: stop_on_first_tool | run_llm_again\nOr {stopAtToolNames: [read_workshop]}",
  67: "toolUseBehavior(context, results)\nComplete → {isFinalOutput: true, finalOutput}\nIncomplete → {isFinalOutput: false}",
  68: "isEnabled({runContext}) → context.showEditor\nexecute → check context.canEdit → update local fixture",
  69: "modelSettings.parallelToolCalls\nrunOptions.toolExecution.maxFunctionToolConcurrency\nObserve callback start, finish and peak concurrency.",
  70: "resetToolChoice: true | false\nmodelSettings.toolChoice: read_workshop\nmaxTurns: 3",
  71: "tools: [toolSearchTool(), ...toolNamespace({name: classroom, tools})]\nFunction tools configure deferLoading: true",
  72: "programmaticToolCallingTool()\nread_stock.allowedCallers: [programmatic]\nPromise.all(reads) → JavaScript reduction",
  73: "webSearchTool({filters: {allowedDomains: [developers.openai.com]}})\nRead output_text annotations → render URL citations",
  74: "fileSearchTool(VECTOR_STORE_ID, {maxNumResults: 3, includeSearchResults: true})\nUploaded handbook → indexed vector store → answer with file citations",
};
export function controlPreview(number) {
  return previews[number];
}
