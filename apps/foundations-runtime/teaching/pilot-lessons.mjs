import { foundationLessons } from "./foundation-lessons.mjs";
import { instructionLessons } from "./instruction-lessons.mjs";
import { contextReuseLessons } from "./context-reuse-lessons.mjs";

export const pilotLessons = [
  ...foundationLessons,
  ...instructionLessons,
  ...contextReuseLessons,
  {
    number: 5,
    title: "Run your first agent",
    concept: "Agent definition, execution and final output",
    duration: "4 minutes",
    objective:
      "Define an agent, run a question and locate the final response in the returned result.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "A terminal and a browser",
    ],
    execution:
      "The browser classroom selects prepared answers. The TypeScript and Python source examples perform actual SDK runs when executed with configured API credentials.",
    prediction:
      "Which result field does the TypeScript example print, and what changes when you select Python?",
    workflow: [
      {
        title: "Define the agent",
        detail: "Give the tutor a name, model and instructions.",
      },
      {
        title: "Run a question",
        detail: "Pass the agent and question to the SDK run function.",
      },
      {
        title: "Read the response",
        detail: "Inspect finalOutput and print it in application code.",
      },
    ],
    scenarios: [
      {
        name: "Explain an AI agent",
        control: "question",
        value: "What is an AI agent?",
        action:
          "Choose TypeScript and the AI-agent question. Run the exercise and inspect the evidence.",
        expected:
          "The resultField is result.finalOutput. The console evidence contains the displayed answer.",
      },
      {
        name: "Compare another question",
        control: "question",
        value: "What is a function tool?",
        action: "Change the question and run again.",
        expected:
          "The prepared response changes while the TypeScript result-field name stays result.finalOutput.",
      },
      {
        name: "Inspect the Python equivalent",
        control: "language",
        value: "python",
        action:
          "Select Python. Run a classroom example and open the Python source tab.",
        expected:
          "The evidence names result.final_output. The classroom language selector illustrates the API naming. The Python source runs in a Python environment.",
      },
    ],
    sources: [
      {
        key: "first-agent.ts",
        path: "examples/first-agent.ts",
        needle: "const tutor = new Agent",
        label: "TypeScript agent definition and run",
      },
      {
        key: "first_agent.py",
        path: "examples/first_agent.py",
        needle: "Agent(",
        label: "Python agent definition and run",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Learning goal and application",
        action: "Open prompt 5, select Classroom and TypeScript.",
        speech:
          "In this lesson we will follow a question from an agent definition to a final response. The tutor definition contains a name, a model and instructions. The application then supplies a question to the run function. Our goal is to identify these pieces in the source and explain what the returned result contains. The classroom examples use prepared answers so that we can repeat the same demonstration.",
        evidence: "The page identifies the classroom answer as scripted.",
      },
      {
        start: "00:30",
        end: "01:05",
        screen: "Question selector",
        action:
          "Ask learners to predict the result field, then run the AI-agent question.",
        speech:
          "Before running, predict which field the TypeScript example will print. Select the question about an AI agent and run the exercise. Follow the visible stages from definition to response. Open the execution evidence. The result-field entry reads result dot finalOutput. The console entry contains the same answer displayed in the result card. This connects the returned value to the application's presentation step.",
        evidence:
          "resultField equals result.finalOutput; console matches the displayed answer.",
      },
      {
        start: "01:05",
        end: "01:50",
        screen: "TypeScript implementation",
        action: "Expand How it works and select first-agent.ts.",
        speech:
          "Find the Agent constructor in the TypeScript source. Read the tutor's name and teaching instructions. Next, find the call to run. It receives the tutor and the question, and the example awaits completion. The following check handles a missing final output. Finally, console dot log prints the returned text. This file is an executable SDK example. With a configured server-side key, the live path performs an actual model request and its wording can vary.",
        evidence:
          "Agent, await run, maxTurns, finalOutput and console.log appear in the source.",
      },
      {
        start: "01:50",
        end: "02:30",
        screen: "Second classroom question",
        action: "Select the function-tool question and rerun.",
        speech:
          "Change the question to ask about function tools. Predict which parts will change. The answer changes because we selected another prepared response. The agent's role and the result-field name keep their configured values. Distinguish the question supplied to a run from the instructions stored in the agent definition. Both influence an actual model run, and they occupy different positions in the code.",
        evidence:
          "The question and answer change; resultField remains result.finalOutput.",
      },
      {
        start: "02:30",
        end: "03:15",
        screen: "Python selection and source",
        action: "Select Python, run the example and open first_agent.py.",
        speech:
          "Select Python and inspect the corresponding source. The Python example uses Runner dot run and reads final underscore output. The classroom evidence follows that naming. Executing this Python file requires its Python environment and credentials. The in-browser live adapter runs TypeScript. Identify the constructor, the execution call and the printed result in both languages, and connect each line to its role.",
        evidence:
          "Python evidence uses result.final_output; the source contains the Python SDK entry point.",
      },
      {
        start: "03:15",
        end: "04:00",
        screen: "Student worksheet",
        action: "Open the student worksheet and assign the two exercises.",
        speech:
          "Use the worksheet to check your understanding. First, compare the TypeScript and Python field names using the browser evidence. Then, in your own course copy, change the tutor's instruction to request a one-sentence explanation. Identify the exact line you changed and predict its effect on a future live run. Finish by explaining how the application obtains the final response and decides where to display it.",
        evidence:
          "Learners identify the correct fields and separate the classroom fixture from the executable SDK source.",
      },
    ],
    exercises: [
      {
        title: "Compare the result fields",
        task: "Run the same classroom question in TypeScript and Python. Record the resultField value for each and identify the matching source line.",
        evidence:
          "Two field names, two source locations and a sentence explaining the naming difference.",
        answer:
          "TypeScript uses result.finalOutput. Python uses result.final_output. The browser language selection changes the illustrated field name and source example.",
      },
      {
        title: "Change the tutor's instructions",
        task: "In your own workspace copy, edit the TypeScript tutor's instructions to request one sentence. Record the original and revised instructions. Predict how you would verify the change with the live source example.",
        evidence:
          "A before/after instruction and a verification plan that distinguishes prepared classroom answers from an actual model response.",
        answer:
          "Edit instructions in foundations-runtime/examples/first-agent.ts. The prepared browser answer is selected independently. An actual run of the edited source requires configured credentials and can then be inspected for the requested response shape.",
      },
    ],
    assessment: [
      {
        question: "What does run receive in the TypeScript example?",
        answer:
          "The configured tutor agent and the question, plus run options such as maxTurns.",
      },
      {
        question: "Where does printing happen?",
        answer: "Application code calls console.log with result.finalOutput.",
      },
      {
        question: "What does the classroom answer demonstrate?",
        answer:
          "A repeatable response and its evidence fields. The actual SDK source and live adapter provide the model-backed execution path.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 5 and select Classroom, TypeScript and the AI-agent question.",
        "Confirm the source tabs and result evidence are visible at your recording resolution.",
        "Keep the first-agent.ts and first_agent.py files available for the source comparison.",
      ],
      misconceptions: [
        "An Agent definition stores configuration. A call to run performs execution.",
        "The application reads and displays the final response.",
        "The classroom question menu selects prepared answers. Changes to the live source require a corresponding live execution to observe their model effect.",
      ],
      troubleshooting: [
        "If the classroom question is rejected, select one of the listed questions.",
        "For a live demonstration, select TypeScript and configure the selected app's server environment using its existing run guide.",
        "If the port is occupied, stop the previous instance or configure PORT and use the URL printed by the server.",
      ],
      rubric: [
        "1 point for locating the agent definition",
        "1 point for locating the execution call",
        "1 point for distinguishing finalOutput and final_output",
        "1 point for explaining the classroom and live execution paths",
      ],
    },
    references: [
      {
        title: "Official OpenAI guide to running agents",
        url: "https://developers.openai.com/api/docs/guides/agents/running-agents",
      },
    ],
  },
  {
    number: 57,
    title: "Give an agent a function tool",
    concept: "Tool schema, application callback and returned evidence",
    duration: "4 minutes",
    objective:
      "Register a calculator tool and use execution evidence to determine whether its application callback ran.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Understanding of an agent definition and a run result",
    ],
    execution:
      "The installed SDK validates and invokes the calculator tool. Classroom model decisions are scripted, and the arithmetic callback executes in application code.",
    prediction:
      "What will 12.5 × 3 produce, and how many calculator callbacks will the conceptual question execute?",
    workflow: [
      {
        title: "Register calculate",
        detail: "Expose an operation and two finite-number arguments.",
      },
      {
        title: "Execute the callback",
        detail:
          "The SDK invokes application arithmetic for the selected tool call.",
      },
      {
        title: "Inspect the result",
        detail:
          "Compare callback observations with the model-visible tool output.",
      },
    ],
    scenarios: [
      {
        name: "Arithmetic question",
        control: "calculatorQuestion",
        value: "arithmetic",
        action: "Choose Calculate 12.5 × 3 and run the exercise.",
        expected:
          "One callback execution. The observed result has operation multiply, left 12.5, right 3 and value 37.5.",
      },
      {
        name: "Conceptual question",
        control: "calculatorQuestion",
        value: "concept",
        action: "Choose the explanation question and run again.",
        expected:
          "Zero calculator executions. The prepared model response explains the tool directly.",
      },
    ],
    sources: [
      {
        key: "tools/calculator.ts",
        path: "examples/tools/calculator.ts",
        needle: "export function createCalculator",
        label: "Calculator schema and callback",
      },
      {
        key: "tools/tools-execution.mjs",
        path: "tools-execution.mjs",
        needle: "// lesson:57",
        label: "Agent registration, scripted calls and observations",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Learning goal and calculator scenario",
        action: "Open prompt 57 in Classroom and select arithmetic.",
        speech:
          "We will give an agent a calculator implemented by our application. The tool definition describes its inputs, and the execute callback performs the arithmetic. In this classroom run the model's choice is scripted. The installed SDK still validates and invokes the actual tool. Predict the result of twelve point five multiplied by three, and predict how many callback executions the evidence will record.",
        evidence:
          "The execution scope identifies scripted decisions and actual tool execution.",
      },
      {
        start: "00:30",
        end: "01:10",
        screen: "Arithmetic result and evidence",
        action: "Run arithmetic and open the evidence.",
        speech:
          "Run the calculation and inspect the evidence. Tool executions should equal one. Expand the observed result and locate the operands, the operation and the value. Twelve point five multiplied by three produces thirty-seven point five. Then inspect the model-visible result. This is the data the SDK supplies after the callback. We can now explain the final answer using an observed application result.",
        evidence:
          "toolExecutions is 1 and observedResults contains value 37.5.",
      },
      {
        start: "01:10",
        end: "01:55",
        screen: "Calculator implementation",
        action: "Open the calculator.ts source.",
        speech:
          "Read the tool's name and description. The Zod schema limits operation to add, subtract, multiply or divide. Both operands must be finite numbers. Now find execute. It chooses the corresponding arithmetic function and constructs a result object. The callback also records the result for our evidence panel. The error handler supplies a controlled message for invalid calculations. Identify where division by zero is handled.",
        evidence:
          "The source shows the schema, execute callback, finite-result check and errorFunction.",
      },
      {
        start: "01:55",
        end: "02:35",
        screen: "Agent registration and SDK loop",
        action: "Open the prompt 57 section of tools-execution.mjs.",
        speech:
          "Find the calculator in the agent's tools array. This makes the capability available to the run. The arithmetic classroom scenario produces a scripted function call with the operation and operands. The SDK processes that call, invokes the registered callback and supplies its output to the next model turn. Follow the same values from the call arguments to the observed result and then to the final response.",
        evidence:
          "The tool registration and the multiply call use the same calculator name.",
      },
      {
        start: "02:35",
        end: "03:15",
        screen: "Conceptual scenario",
        action: "Switch to the conceptual question and rerun.",
        speech:
          "Change the question to ask what a calculator tool does. Predict the callback count before running. This scenario returns a prepared explanation directly, and the execution count is zero. Use that count to describe what actually happened. Registration gives the agent an available capability. In live mode the configured model chooses actions from its input and instructions, so review the resulting evidence for each run.",
        evidence: "toolExecutions is 0 and the response explains the tool.",
      },
      {
        start: "03:15",
        end: "04:00",
        screen: "Student worksheet and code challenge",
        action: "Assign comparison and calculator-argument exercises.",
        speech:
          "Record the callback count for each scenario and explain why it differs. For the code exercise, use your own course copy and change the scripted arithmetic example to seven multiplied by six. Update the question text to match, restart the application and inspect the result. A successful check records the new operands, one callback execution and the value forty-two. Finish by identifying which code validates the arguments and which code calculates the answer.",
        evidence:
          "A modified workspace run should show left 7, right 6, value 42 and one callback.",
      },
    ],
    exercises: [
      {
        title: "Compare tool use",
        task: "Run arithmetic and conceptual scenarios. Record toolExecutions and the observed output for each. Explain how the evidence supports your account of the SDK loop.",
        evidence:
          "A comparison showing 1 execution for arithmetic and 0 for the conceptual question.",
        answer:
          "The arithmetic fixture emits a calculate call and invokes the real callback. The conceptual fixture emits a direct explanation.",
      },
      {
        title: "Change the arithmetic example",
        task: "In your own workspace copy, find the prompt 57 section of tools-execution.mjs. Change the scripted operands to 7 and 6 and update its question text to match. Restart and run the arithmetic scenario.",
        evidence:
          "Observed operands 7 and 6, operation multiply, value 42 and toolExecutions 1.",
        answer:
          "Change left and right in the scripted calculate call and the arithmetic question supplied to runner.run. The shared calculator implementation can be reused without changing its multiplication operation.",
      },
    ],
    assessment: [
      {
        question: "Which code validates the tool arguments?",
        answer: "The tool's Zod parameters schema, processed by the SDK.",
      },
      {
        question: "Which code performs the multiplication?",
        answer:
          "The execute callback in calculator.ts invokes the multiply operation.",
      },
      {
        question: "What proves that a callback ran?",
        answer:
          "The application observation count and recorded callback result in the execution evidence.",
      },
    ],
    instructor: {
      preparation: [
        "Select Classroom and the arithmetic scenario.",
        "Confirm the unmodified arithmetic example produces value 37.5 and one callback.",
        "Prepare the calculator.ts source and the prompt 57 orchestration section for the walkthrough.",
      ],
      misconceptions: [
        "The callback performs arithmetic in application code.",
        "A registered tool can remain unused in a run.",
        "Classroom model choices are scripted. Observed callback execution is produced by the installed SDK and application implementation.",
      ],
      troubleshooting: [
        "After changing shared source, restart the server to reload the module.",
        "Keep the question text and scripted operands consistent during the code challenge.",
        "If a live run chooses a different path, inspect its actual callback count and model-visible outputs.",
      ],
      rubric: [
        "1 point for the correct arithmetic value",
        "1 point for the two callback counts",
        "1 point for locating schema and callback",
        "1 point for a consistent modified example with value 42",
      ],
    },
    references: [
      {
        title: "Official OpenAI function-calling guide",
        url: "https://developers.openai.com/api/docs/guides/function-calling",
      },
    ],
  },
  {
    number: 127,
    title: "Review an agent's proposed action",
    concept: "Human approval, persisted run state and verified side effects",
    duration: "5 minutes",
    objective:
      "Inspect a proposed tool call, approve or reject its stored review, and verify the number of committed changes.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Understanding of a function tool and its arguments",
    ],
    execution:
      "The actual SDK pauses at an approval interruption. Review state and synthetic record changes are stored in local SQLite. The reviewing identity is the teacher fixture.",
    prediction:
      "How many record changes will exist while the proposed update is waiting for a decision?",
    workflow: [
      {
        title: "Propose an update",
        detail:
          "The SDK records an approval interruption with exact tool arguments.",
      },
      {
        title: "Review the stored call",
        detail:
          "The teacher fixture approves or rejects the existing review ID.",
      },
      {
        title: "Verify the write",
        detail: "Inspect uniqueSideEffects and the returned execution receipt.",
      },
    ],
    scenarios: [
      {
        name: "Pause for review",
        control: "scenario",
        value: "pause",
        action:
          "Run pause. Inspect update_record, its recordId and amount, and the reviewer identity.",
        expected:
          "A pending review, executionsBeforeApproval 0 and uniqueSideEffects 0.",
      },
      {
        name: "Approve the paused review",
        control: "review",
        value: "approve",
        action: "Use Approve proposed action on the displayed review card.",
        expected:
          "The same reviewId resumes. The decision becomes approved and uniqueSideEffects becomes 1.",
      },
      {
        name: "Reject a fresh paused review",
        control: "review",
        value: "reject",
        action:
          "Start a fresh pause scenario, then use Reject proposed action on that review card.",
        expected:
          "The decision becomes rejected and uniqueSideEffects stays 0.",
      },
    ],
    sources: [
      {
        key: "course/approval-agent.mjs",
        path: "course/approval-agent.mjs",
        needle: "needsApproval:",
        label: "Approval-required tool and current authorization check",
      },
      {
        key: "course/approvals.mjs",
        path: "course/approvals.mjs",
        needle: "export async function executeApproval",
        label: "Persist, restore, approve and resume the review",
      },
      {
        key: "course/storage.mjs",
        path: "course/storage.mjs",
        needle: "effect(tenant",
        label: "Transactional idempotency and stored receipts",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:35",
        screen: "Learning goal and pause scenario",
        action: "Open prompt 127 and choose pause.",
        speech:
          "We will review a proposed record update before its callback can commit a change. The SDK supplies the approval interruption. Our application persists the run state, displays the proposed arguments and records a decision. The record and reviewing identity are classroom fixtures backed by local SQLite. Predict how many committed changes will exist while the review is pending.",
        evidence:
          "The page identifies the teacher fixture and local execution scope.",
      },
      {
        start: "00:35",
        end: "01:15",
        screen: "Pending review card",
        action: "Run pause and inspect the proposed tool and arguments.",
        speech:
          "Run the pause scenario. Find the update_record tool, record identifier and amount on the review card. Read the reviewing identity. Open the execution evidence and check executionsBeforeApproval and uniqueSideEffects. Both should be zero. The pending action describes a request to execute the callback. At this point the application has saved the review state and can present it for a decision.",
        evidence:
          "A pending update_record review contains record-1 and amount 50. Committed effects are 0.",
      },
      {
        start: "01:15",
        end: "02:00",
        screen: "Approval-required tool source",
        action: "Open approval-agent.mjs and find needsApproval and execute.",
        speech:
          "Locate needsApproval in the tool definition. Then inspect execute. It checks the current application permission and uses an operation key when committing the synthetic change. These checks serve different parts of the workflow. The approval decision resolves the SDK pause. Current authorization governs access at execution time. The transaction and operation key let the application recognize repeated delivery of the same operation.",
        evidence:
          "The source includes needsApproval, store.authorized and store.effect.",
      },
      {
        start: "02:00",
        end: "02:55",
        screen: "Approve the existing review",
        action: "Click Approve proposed action and inspect the updated result.",
        speech:
          "Use the approval button on the pending card. This button submits the existing review ID to the backend. The application restores the saved state, records approval and resumes the SDK run. Inspect the final decision and uniqueSideEffects. The approval path commits one synthetic change and returns its receipt. Compare the displayed arguments with the receipt so that the proposed action and the observed write can be connected.",
        evidence:
          "The review ID is preserved, the decision is approved and uniqueSideEffects is 1.",
      },
      {
        start: "02:55",
        end: "03:45",
        screen: "Reject a fresh review",
        action:
          "Reset, select pause again, run and click Reject proposed action.",
        speech:
          "Start a fresh paused review for the rejection comparison. Confirm that its proposed arguments are visible, then reject that pending action. Inspect the decision and the count of committed effects. The decision should read rejected and the count should remain zero. Compare the approval and rejection branches using the evidence from each independent review. Keep their review IDs alongside your observations.",
        evidence: "A fresh review is rejected and uniqueSideEffects is 0.",
      },
      {
        start: "03:45",
        end: "04:25",
        screen: "Persisted state and resumption source",
        action:
          "Open approvals.mjs and locate saveRun, RunState.fromString and runner.run.",
        speech:
          "Follow the persistence path in the source. The application serializes the SDK state and saves it with configuration for the review. A subsequent decision request loads that saved state and reconstructs the agent. The state receives the approval or rejection, and the runner resumes it. The selector's approve and reject scenarios each prepare their own exercise run. The review-card buttons demonstrate a later request resuming the displayed paused run.",
        evidence:
          "The existing reviewId selects stored state before the decision is applied.",
      },
      {
        start: "04:25",
        end: "05:00",
        screen: "Student comparison and rubric",
        action: "Assign the approval and rejection worksheet.",
        speech:
          "Complete two independent trials and record the review ID, decision and committed-effect count. Your approval trial should finish with one effect, and your rejection trial with zero. Identify where the source requests approval, checks current access and enforces idempotency. Finish by explaining which evidence would justify telling a user that the proposed update actually committed.",
        evidence:
          "Learners connect a decision to its stored review and observed write receipt.",
      },
    ],
    exercises: [
      {
        title: "Approve a stored review",
        task: "Run pause. Record the review ID, tool arguments and committed-effect count. Approve using the review-card button, then record the same review ID, final decision and new count.",
        evidence:
          "One review ID across both requests, decision approved and effect count changing from 0 to 1.",
        answer:
          "Use the review card for the existing pending action. Approval resumes its stored SDK state and commits one synthetic effect.",
      },
      {
        title: "Reject a fresh review",
        task: "Reset and run a new pause scenario. Record its ID and arguments. Reject using the review-card button and explain the final evidence.",
        evidence:
          "A fresh review ID, decision rejected and uniqueSideEffects 0.",
        answer:
          "Rejection resolves the pending call without committing its record update. The recorded final response alone should be read together with the decision and effect-count evidence.",
      },
    ],
    assessment: [
      {
        question: "What identifies the stored review across requests?",
        answer:
          "The reviewId returned by the pause scenario and submitted by the review-card button.",
      },
      {
        question: "What proves that an approved change committed?",
        answer:
          "The transactional receipt and uniqueSideEffects count for the reviewed operation.",
      },
      {
        question: "Where is current permission checked?",
        answer:
          "Inside the update_record execute callback through store.authorized.",
      },
    ],
    instructor: {
      preparation: [
        "Select pause and confirm that a newly created review reports zero committed effects.",
        "Use review-card buttons for the cross-request demonstration.",
        "Keep approval-agent.mjs, approvals.mjs and storage.mjs available in the source explorer.",
      ],
      misconceptions: [
        "A proposed tool call can wait for human review before its callback executes.",
        "The review-card button resumes its existing stored review. The scenario selector starts a separate exercise invocation.",
        "The teacher identity and records are local fixtures. Production identity and authorization must come from the application's authenticated context.",
      ],
      troubleshooting: [
        "After rejecting a review, create a fresh paused review for the approval comparison.",
        "If review state is missing, start a fresh pause and use its newly displayed card.",
        "When interpreting repeated requests, inspect the operation receipt and unique effect count together.",
      ],
      rubric: [
        "1 point for recording a review ID and exact arguments",
        "1 point for observing 0 effects while pending",
        "1 point for the approved count of 1",
        "1 point for a fresh rejected count of 0",
        "1 point for identifying authorization and idempotency checks",
      ],
    },
    references: [
      {
        title: "Official OpenAI guide to guardrails and human review",
        url: "https://developers.openai.com/api/docs/guides/agents/guardrails-approvals",
      },
    ],
  },
].sort((left, right) => left.number - right.number);

export function getPilotLesson(number) {
  const lesson = pilotLessons.find(
    (lesson) => lesson.number === Number(number),
  );
  if (!lesson)
    throw new Error(
      `Choose pilot prompt ${pilotLessons.map((lesson) => lesson.number).join(", ")}.`,
    );
  return lesson;
}
