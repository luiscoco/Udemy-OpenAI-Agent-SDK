export const productCases = {
  valid: { name: "Classroom mug", price: 12.5 },
  "missing-field": { price: 12.5 },
  "wrong-type": { name: "Classroom mug", price: "twelve" },
  "numeric-string": { name: "Classroom mug", price: "12.50" },
};

export const evidenceRegistry = {
  "catalog-robotics": "Classroom catalog confirms the kit.",
  "stock-lab": "Classroom inventory confirms availability.",
};

export function orderFixture(scenario = "valid") {
  const order = {
    startDate: "2026-11-12",
    endDate: "2026-11-13",
    quantity: 2,
    evidenceIds: ["catalog-robotics", "stock-lab"],
  };
  if (scenario === "reversed-dates") order.endDate = "2026-11-01";
  if (scenario === "invalid-date") order.startDate = "2026-02-30";
  if (scenario === "zero-quantity") order.quantity = 0;
  if (scenario === "missing-evidence")
    order.evidenceIds = ["invented-reference"];
  if (
    ![
      "valid",
      "reversed-dates",
      "invalid-date",
      "zero-quantity",
      "missing-evidence",
    ].includes(scenario)
  )
    throw new Error("Choose a listed business-validation scenario.");
  return order;
}

const schemaCases = {
  key: "schemaCase",
  label: "Candidate model output",
  options: [
    ["valid", "Valid product"],
    ["missing-field", "Missing product name"],
    ["wrong-type", "Invalid price text"],
    ["numeric-string", "Numeric string price"],
  ],
};
export const structuredControls = {
  25: [schemaCases],
  26: [schemaCases],
  27: [
    {
      key: "nestedCase",
      label: "Nested model output",
      options: [
        ["null-note", "Valid · nullable note"],
        ["with-note", "Valid · text note"],
        ["invalid-enum", "Invalid priority"],
        ["missing-name", "Missing nested customer name"],
      ],
    },
  ],
  28: [
    {
      key: "businessCase",
      label: "Business rule scenario",
      options: [
        ["valid", "All business rules pass"],
        ["reversed-dates", "End precedes start"],
        ["invalid-date", "Invalid calendar date"],
        ["zero-quantity", "Zero quantity"],
        ["missing-evidence", "Unverified evidence ID"],
      ],
    },
  ],
  29: [
    {
      key: "resultCase",
      label: "Run outcome",
      options: [
        ["complete", "Completed structured result"],
        ["refusal", "Refusal fixture"],
        ["incomplete", "Incomplete provider result fixture"],
        ["approval", "Actual SDK approval interruption"],
      ],
    },
  ],
  30: [
    {
      key: "visionTask",
      label: "Image question",
      options: [
        ["describe", "Describe the shapes"],
        ["count", "Count shapes by color"],
      ],
    },
  ],
  31: [
    {
      key: "documentFormat",
      label: "Document input",
      options: [
        ["pdf", "PDF document"],
        ["text", "Plain text contents"],
      ],
    },
    {
      key: "documentQuestion",
      label: "Question",
      options: [
        ["summary", "Summarize the workshop"],
        ["schedule", "Extract its schedule"],
      ],
    },
  ],
  32: [
    {
      key: "toolModality",
      label: "Tool result modality",
      options: [
        ["text", "Text result"],
        ["image", "Image result"],
        ["file", "PDF file result"],
      ],
    },
  ],
  33: [
    {
      key: "modelScope",
      label: "Model configuration",
      options: [
        ["all", "Agent + workflow + process"],
        ["workflow", "Workflow + process"],
        ["process", "Process only"],
      ],
    },
  ],
  34: [
    {
      key: "modelPreset",
      label: "Model compatibility profile",
      options: [
        ["astra", "GPT-6 Astra · reasoning"],
        ["luna", "GPT-6 Luna · reasoning none"],
      ],
    },
    {
      key: "settingsCase",
      label: "Requested generation setting",
      options: [
        ["verbosity", "Verbosity and output-token budget"],
        ["temperature", "Temperature"],
        ["top-p", "Top P"],
      ],
    },
  ],
};

export const structuredHints = {
  25: "Run the actual Python Agents SDK with a Pydantic output type. Classroom mode uses a local scripted Python model. The SDK's strict output validation rejects numeric strings.",
  26: "The actual TypeScript SDK validates its final output with Zod. Compare a number with a numeric string and inspect rejected candidates.",
  27: "Inspect a nested customer, item array, priority enum, and nullable note. Schema validation runs on the actual SDK output.",
  28: "First validate the structural schema, then check calendar dates, ordering, quantity, and evidence against the application's fixture registry.",
  29: "Inspect completion before consuming structured data. Refusal and incomplete outcomes are explicit result fixtures. The approval example pauses a real SDK run.",
  30: "The actual PNG is attached to the SDK request. Classroom observations are scripted fixtures. Live API sends the image to your configured vision-capable model.",
  31: "Inspect the bundled PDF and its text. Classroom answers are scripted. Live mode passes the selected document content to a compatible model.",
  32: "A real SDK tool returns supported text, image, or file content. Inspect the next model-adapter request after the tool executes.",
  33: "An isolated Node process runs the actual SDK model-resolution path. A local adapter replaces network inference after resolution, so no API request is made.",
  34: "Inspect the installed SDK's modelSettings and model-specific compatibility checks. Local capture shows the requested settings. Live mode uses only compatible combinations.",
};

export function structuredPreview(number, input) {
  if ([25, 26].includes(number))
    return JSON.stringify(productCases[input.schemaCase ?? "valid"], null, 2);
  if (number === 27)
    return "customer: { name: string }\nitems: [{ name: string, quantity: number }]\npriority: low | high\nnote: string | null";
  if (number === 28)
    return JSON.stringify(orderFixture(input.businessCase), null, 2);
  if (number === 29)
    return "Inspect interruptions, refusals, provider completion, and final output before accepting schema-valid data.";
  if (number === 30)
    return "A blue rectangle, a green circle, and an orange triangle form the deterministic teaching image. Classroom answers use a known fixture.";
  if ([31, 32].includes(number))
    return "Workshop plan\nRobotics for beginners · 30 minutes\n5 min introduction · 20 min building · 5 min reflection\nMaterials: robotics kits and projector.";
  if (number === 33)
    return "Agent model: gpt-6-astra\nWorkflow default: gpt-6-sol\nProcess default: gpt-6-luna\nDisable higher-precedence settings using the selector.";
  return "GPT-6 Astra uses reasoning and rejects custom temperature/top_p. The GPT-6 Luna profile uses reasoning none for sampling examples. Check the linked compatibility guidance for current support.";
}
