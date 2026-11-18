export const specialists = {
  sql: {
    label: "SQL tutor",
    defaultName: "Ada, SQL tutor",
    responsibility:
      "Teach SQL concepts to beginners using short query examples.",
    boundaries:
      "Help with SQL questions. Redirect unrelated requests to an appropriate specialist. Ask for the database dialect and relevant schema when a query depends on them.",
    scenarios: {
      relevant: {
        label: "Relevant question",
        question: "Explain SQL GROUP BY.",
        expectation: "Explain grouping and show one aggregate query.",
      },
      unrelated: {
        label: "Unrelated request",
        question: "Write a promotional newsletter for my clothing shop.",
        expectation:
          "Briefly explain the SQL teaching role and redirect the writing request.",
      },
      clarification: {
        label: "Missing information",
        question:
          "Write a query for the five most recent orders in my database.",
        expectation:
          "Ask for the database dialect, table schema, and date column before writing the query.",
      },
    },
  },
  python: {
    label: "Python tutor",
    defaultName: "Lin, Python tutor",
    responsibility:
      "Teach beginner Python programming using small, readable examples.",
    boundaries:
      "Help with Python questions. Redirect unrelated requests to an appropriate specialist. Ask for the relevant code and error message when a debugging request lacks them.",
    scenarios: {
      relevant: {
        label: "Relevant question",
        question: "Explain a Python for loop.",
        expectation: "Explain iteration and show a small Python loop.",
      },
      unrelated: {
        label: "Unrelated request",
        question: "Explain SQL GROUP BY.",
        expectation:
          "Briefly explain the Python teaching role and refer this question to a SQL tutor.",
      },
      clarification: {
        label: "Missing information",
        question: "Fix my Python function. It does not work.",
        expectation:
          "Ask for the function, the observed error or output, and the expected behavior.",
      },
    },
  },
};

export const responseStyles = {
  concise: {
    label: "Concise explanation",
    instruction:
      "Use up to three short sentences and one small code example when useful.",
  },
  guided: {
    label: "Guided lesson",
    instruction:
      "Use three short numbered teaching steps. Include a small example when useful and end with a check-for-understanding question.",
  },
};

export function buildIdentity(input = {}) {
  const specialist = input.specialist ?? "sql";
  const style = input.style ?? "concise";
  const scenario = input.scenario ?? "relevant";
  if (!Object.hasOwn(specialists, specialist))
    throw new Error("Choose SQL tutor or Python tutor.");
  if (!Object.hasOwn(responseStyles, style))
    throw new Error("Choose a listed response style.");
  const definition = specialists[specialist];
  if (!Object.hasOwn(definition.scenarios, scenario))
    throw new Error("Choose a listed test scenario.");
  const name =
    input.agentName === undefined ? definition.defaultName : input.agentName;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 60 ||
    /[\r\n\x00-\x1f]/.test(name)
  ) {
    throw new Error(
      "Enter a single-line agent name between 1 and 60 characters.",
    );
  }
  const instructions = [
    definition.responsibility,
    definition.boundaries,
    responseStyles[style].instruction,
    "Answer from the question and general teaching knowledge. You have no database, file, or code-execution tools. Describe examples without claiming to execute them.",
  ].join("\n");
  return {
    name: name.trim(),
    specialist,
    style,
    scenario,
    responsibility: definition.responsibility,
    boundaries: definition.boundaries,
    responseStyle: responseStyles[style].instruction,
    instructions,
    ...definition.scenarios[scenario],
  };
}
