import { buildIdentity } from "./public/identity.js";
import { runSpecialist } from "./examples/identity/run-specialist.mjs";

const classroomAnswers = {
  sql: {
    relevant: {
      concise:
        "GROUP BY collects rows with the same value so aggregate functions can summarize each group. This query counts orders for each customer.\n\nSELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;",
      guided:
        "1. Choose the grouping column, such as customer_id.\n2. Use COUNT(*) to count rows inside each customer group.\n3. Combine them in a query.\n\nSELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;\n\nWhat would one row of this result represent?",
    },
    unrelated: {
      concise:
        "I teach SQL and can help you query your shop's database. A marketing writer would be a better specialist for your promotional newsletter.",
      guided:
        "1. My teaching role covers SQL queries and database concepts.\n2. A promotional newsletter belongs with a marketing writer.\n3. I can help with a related SQL question, such as counting shop orders.\n\nWould you like to explore an order-count query?",
    },
    clarification: {
      concise:
        "Which database dialect are you using, such as PostgreSQL, SQL Server, or SQLite? Please share the orders table schema and the column that records when an order was placed.",
      guided:
        "1. Tell me your database dialect so I can choose the correct row-limit syntax.\n2. Share the orders table schema.\n3. Identify the order-date column used to sort the results.\n\nWhich database are you using?",
    },
  },
  python: {
    relevant: {
      concise:
        'A Python for loop visits each item in an iterable and runs the indented body for that item. This loop prints each club name.\n\nfor club in ["Robotics", "Music"]:\n    print(club)',
      guided:
        '1. Start with an iterable, such as a list of club names.\n2. The loop assigns one item at a time to club.\n3. The indented body runs for each item.\n\nfor club in ["Robotics", "Music"]:\n    print(club)\n\nHow many times does print run here?',
    },
    unrelated: {
      concise:
        "I teach beginner Python programming. A SQL tutor can explain GROUP BY and its aggregate queries. I can help you understand Python loops or dictionaries.",
      guided:
        "1. My role covers beginner Python programming.\n2. A SQL tutor is the appropriate specialist for GROUP BY.\n3. I can help with a Python concept, such as grouping values in a dictionary.\n\nWould you like a Python dictionary example?",
    },
    clarification: {
      concise:
        "Please share your Python function, the error message or actual output, and the behavior you expected. With those details, I can help explain the problem.",
      guided:
        "1. Share the Python function you want to fix.\n2. Include its error message or actual output.\n3. Describe the expected behavior.\n\nCan you paste a small example that reproduces the issue?",
    },
  },
};

const event = (title, detail, actor = "application") => ({
  title,
  detail,
  actor,
});

export async function executeIdentity(input, options) {
  const identity = buildIdentity(input);
  const isLive = input.mode === "live";
  let output =
    classroomAnswers[identity.specialist][identity.scenario][identity.style];
  let question = identity.question;
  let modelResponses = 0;
  if (isLive) {
    const actual = await runSpecialist({ input, ...options });
    output = actual.result.finalOutput;
    question = actual.question;
    modelResponses = actual.result.rawResponses?.length ?? null;
  } else if (
    input.question !== undefined &&
    input.question !== identity.question
  ) {
    throw new Error(
      "Classroom mode uses the listed test questions. Use Live API for a custom question.",
    );
  }
  return {
    label: isLive
      ? "Actual specialist Agents SDK run"
      : "Actual identity construction + scripted model answer",
    events: [
      event(
        "Name the specialist",
        `${identity.name} is the agent's human-readable identifier.`,
      ),
      event("Define its responsibility", identity.responsibility, "sdk"),
      event(
        "Set boundaries and response style",
        `${identity.boundaries}\n${identity.responseStyle}`,
        "sdk",
      ),
      event(
        "Test the request",
        `${question}\n${isLive ? "Inspect the actual answer against the instructions." : `Expected classroom behavior: ${identity.expectation}`}`,
        "model",
      ),
    ],
    output,
    evidence: {
      execution: isLive ? "live SDK result" : "scripted classroom fixture",
      agent: {
        name: identity.name,
        instructions: identity.instructions,
        configuredTools: [],
      },
      specialist: identity.specialist,
      responseStyle: identity.style,
      scenario: identity.scenario,
      question,
      expectedBehavior:
        isLive &&
        input.question !== undefined &&
        input.question.trim() !== identity.question
          ? "Compare the custom request and actual response against this agent's responsibility, boundaries, and style."
          : identity.expectation,
      modelResponses,
      boundaryMechanism:
        "Instructions guide model behavior. Resource permissions belong in application code. This agent has no database or execution tools.",
    },
    takeaway:
      "The name identifies the agent. Its instructions define the responsibility, boundaries, and response style. Check live behavior against those instructions.",
  };
}
