export const foundationLessons = [
  {
    number: 6,
    title: "Follow the agent loop",
    concept: "Model decisions, local tool execution and completion",
    duration: "3 minutes",
    objective:
      "Trace a timetable question through a tool request, local lookup, returned data and final response.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Understanding of an agent definition and final output",
    ],
    execution:
      "Classroom mode executes lookupActivity on the server. Its two model decisions and final sentence are scripted in application code. The live service runs the installed Agents SDK with configured credentials.",
    prediction:
      "Which component reads the timetable, and what happens after that function returns?",
    workflow: [
      {
        title: "Request a lookup",
        detail: "The classroom decision supplies an activity argument.",
      },
      {
        title: "Execute local code",
        detail: "lookupActivity returns a bundled timetable entry.",
      },
      {
        title: "Complete the response",
        detail:
          "The illustrated loop returns the data before forming the answer.",
      },
    ],
    scenarios: [
      {
        name: "Robotics timetable",
        control: "activity",
        value: "robotics",
        action:
          "Choose Robotics club, run the exercise and expand the evidence.",
        expected:
          "Robotics meets Tuesday at 16:00 in Lab 2. actualLocalToolCalls is 1 and simulatedModelCalls is 2.",
      },
      {
        name: "Astronomy comparison",
        control: "activity",
        value: "astronomy",
        action: "Choose Astronomy club and run again.",
        expected:
          "The argument and toolResult change to Astronomy, Thursday, 17:00, Science room. The illustrated loop still contains one local lookup.",
      },
    ],
    sources: [
      {
        key: "tools/club.mjs",
        path: "examples/organized/tools/club.mjs",
        needle: "export function lookupActivity",
        label: "Local timetable lookup",
      },
      {
        key: "agents/club-agent.mjs",
        path: "examples/organized/agents/club-agent.mjs",
        needle: "const lookup = tool",
        label: "SDK tool registration",
      },
      {
        key: "services/club-service.mjs",
        path: "examples/organized/services/club-service.mjs",
        needle: "const result = await runner.run",
        label: "Live SDK execution",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Learning goal and club selector",
        action: "Open prompt 6 in Classroom with Robotics club selected.",
        speech:
          "We will follow a timetable question through an agent loop. Predict which part reads the timetable and which part completes the response. This classroom demonstration scripts the model decisions and assembles the final sentence. The local lookup function actually executes on the server, so its returned data gives us something concrete to verify.",
        evidence:
          "The execution scope identifies the scripted decisions and actual local function.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Execution stages",
        action: "Run Robotics club and inspect the four stages.",
        speech:
          "The first stage illustrates a request to lookup_activity with robotics as its argument. The next stage executes our local lookup. Then the timetable data returns to the illustrated model step, followed by completion. Read these stages in order and identify where application code performs the lookup. A real runner may continue through additional turns when the model requests more work.",
        evidence:
          "The stages show request, tool execution, returned data and completion.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Execution evidence",
        action:
          "Expand the evidence and compare the displayed answer with toolResult.",
        speech:
          "The evidence names the function and its activity argument. Robotics meets Tuesday at sixteen hundred in Lab Two. Compare every detail in the answer with the tool result. The counters identify one actual local tool call and two simulated model calls. Those labels tell us exactly what this classroom exercise measured and illustrated.",
        evidence:
          "actualLocalToolCalls is 1, simulatedModelCalls is 2 and toolResult matches the answer.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Tool and agent source",
        action:
          "Expand How it works and inspect tools/club.mjs and agents/club-agent.mjs.",
        speech:
          "Open the lookup source and find the bundled timetable and unknown-activity check. The function returns a copy of the selected entry. In the agent module, find the tool name, its activity enum and its execute callback. The callback calls our lookup function and returns its data. The tool schema defines the supported inputs for the SDK path.",
        evidence:
          "The source includes lookupActivity, z.enum and the tool execute callback.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Comparison and service source",
        action: "Run Astronomy club, then inspect services/club-service.mjs.",
        speech:
          "Change the activity to astronomy and repeat the comparison. The returned day, time and room change with the argument. Now open the service module and locate Runner and runner.run. This is the live SDK execution path. Its observed tool calls and model responses depend on the actual run, so use its returned evidence when demonstrating live behavior.",
        evidence:
          "Astronomy returns Thursday, 17:00 and Science room. The service awaits runner.run.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student worksheet",
        action: "Assign the two-club comparison and loop-order exercise.",
        speech:
          "Record the argument, returned timetable and execution counters for two clubs. Then arrange the four loop stages in order and identify the module that performs each operation. Finish by explaining what changes when the model decides it has enough information to produce a final response. Support your explanation with the displayed stages and source.",
        evidence:
          "Learners connect arguments, returned data and completion using two observed trials.",
      },
    ],
    exercises: [
      {
        title: "Compare two timetable lookups",
        task: "Run robotics and astronomy. Record the argument, day, time, room and both execution counters for each trial.",
        evidence:
          "Two completed evidence records and a comparison of their changed fields.",
        answer:
          "Robotics returns Tuesday, 16:00, Lab 2. Astronomy returns Thursday, 17:00, Science room. Each classroom run records one actual local tool call and two simulated model calls.",
      },
      {
        title: "Explain the loop",
        task: "Order the request, execution, returned data and completion stages. Locate the tool callback and live runner in the source.",
        evidence: "An ordered four-stage trace with module names.",
        answer:
          "The illustrated decision requests lookup_activity, the callback reads lookupActivity, data returns, and a final response completes the trace. club-agent.mjs registers the callback and club-service.mjs calls runner.run.",
      },
    ],
    assessment: [
      {
        question: "Where does the timetable come from?",
        answer:
          "The bundled activities object read by lookupActivity in tools/club.mjs.",
      },
      {
        question: "What does simulatedModelCalls measure here?",
        answer:
          "The two modeled decision stages in the classroom trace. Live inference requires the configured SDK service.",
      },
      {
        question:
          "What follows a function-tool result in a continuing agent run?",
        answer:
          "The runner supplies the result for the next model step, which can complete or request more work.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 6 with Classroom selected.",
        "Confirm Robotics and Astronomy return their expected timetable entries.",
        "Open the tool, agent and service sources before recording.",
      ],
      misconceptions: [
        "The local lookup owns the timetable data.",
        "The browser classroom trace scripts model choices and response assembly.",
        "The live runner's observed counts can vary with the actual model behavior.",
      ],
      troubleshooting: [
        "Use one of the three supported activity values.",
        "Expand execution evidence to inspect the counters.",
        "For live runs, configure the selected application's server environment and inspect actualToolCalls and modelResponses.",
      ],
      rubric: [
        "1 point for identifying the activity argument",
        "1 point for verifying the timetable against toolResult",
        "1 point for ordering the four stages",
        "1 point for explaining the classroom counters",
      ],
    },
    references: [
      {
        title: "Official OpenAI Agents SDK quickstart",
        url: "https://developers.openai.com/api/docs/guides/agents/quickstart",
      },
    ],
  },
  {
    number: 7,
    title: "Trace a request across project modules",
    concept: "Configuration, agent, tool, service and focused tests",
    duration: "3 minutes",
    objective:
      "Locate each module's responsibility and explain how the application service connects a timetable request to a result.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Completion of the agent-loop exercise",
    ],
    execution:
      "Classroom mode executes the local lookup and displays an architectural trace. The live service composes configuration, SDK agent and runner. The browser's Tests stage points to test source. Execute the test command to observe test results.",
    prediction:
      "Which module connects configuration, agent creation and execution?",
    workflow: [
      {
        title: "Separate responsibilities",
        detail: "Inspect configuration, agent, tool and test modules.",
      },
      {
        title: "Compose the request",
        detail: "askClub creates the provider, agent and runner.",
      },
      {
        title: "Verify the contract",
        detail: "Compare returned timetable data and run focused tests.",
      },
    ],
    scenarios: [
      {
        name: "Robotics request",
        control: "activity",
        value: "robotics",
        action: "Run Robotics club and follow the named module stages.",
        expected:
          "The trace names config, agent, service, tool and tests. Evidence contains Robotics and one actual local lookup.",
      },
      {
        name: "Music request",
        control: "activity",
        value: "music",
        action:
          "Run Music club and compare the module roles and returned data.",
        expected:
          "Music meets Wednesday at 15:30 in Studio. Module responsibilities stay the same across inputs.",
      },
    ],
    sources: [
      {
        key: "config.mjs",
        path: "examples/organized/config.mjs",
        needle: "export function loadConfig",
        label: "Server configuration",
      },
      {
        key: "services/club-service.mjs",
        path: "examples/organized/services/club-service.mjs",
        needle: "export async function askClub",
        label: "Application service composition",
      },
      {
        key: "tests/club.test.mjs",
        path: "examples/organized/tests/club.test.mjs",
        needle: 'test("robotics has',
        label: "Focused timetable contract test",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Learning goal and module controls",
        action: "Open prompt 7 in Classroom and select Robotics club.",
        speech:
          "We will follow one request across a small project. Predict which module brings configuration, agent creation and execution together. The page offers shortcuts to configuration, agent, tool, service and test source. The classroom trace illustrates these responsibilities while executing the actual local timetable lookup. We will also run the focused tests separately in the terminal.",
        evidence:
          "The module shortcuts expose five distinct source responsibilities.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Module stages and result",
        action: "Run the exercise and expand execution evidence.",
        speech:
          "Read the named stages and locate each file in the project. The timetable result should match robotics in the argument and tool-result fields. The browser trace includes a Tests stage that explains where tests live. Running the exercise displays that explanation. We must execute the test command to establish whether the assertions pass.",
        evidence: "The result includes Robotics, Tuesday, 16:00 and Lab 2.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Configuration and agent source",
        action:
          "Expand How it works. Select Configuration and Agent using the module buttons.",
        speech:
          "Configuration reads the server environment and rejects a missing API key in the live path. The agent factory receives dependencies and a model, then registers the timetable tool and instructions. Keeping these responsibilities in their own modules makes the composition visible. The classroom lookup can run locally with its bundled data while the live service loads server credentials.",
        evidence:
          "loadConfig checks OPENAI_API_KEY and createClubAgent registers lookup_activity.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Service source",
        action: "Select Service and locate askClub, Runner and runner.run.",
        speech:
          "The application service connects the modules. It loads configuration, constructs the API client and provider, creates the agent, and awaits the runner. It forwards cancellation and checks for a final answer before returning the result. Follow these calls from top to bottom. This source shows how a request enters the live SDK execution path.",
        evidence:
          "askClub composes loadConfig, createClubAgent and runner.run, with signal and maxTurns.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Tests and terminal",
        action:
          "Select Tests. From apps run node --test foundations-runtime/examples/organized/tests/club.test.mjs.",
        speech:
          "Read the two focused tests. One compares the complete robotics timetable entry. The other checks that an unknown activity throws an error. Execute the displayed test file from the apps directory and inspect its pass count. These assertions exercise the local function contract. The browser's final sentence and live model behavior have their own verification paths.",
        evidence: "The terminal reports two passing focused tests.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Music comparison and worksheet",
        action: "Run Music club and assign the responsibility map.",
        speech:
          "Change the request to music and verify Wednesday, fifteen thirty and Studio. The returned data changes through the same module boundaries. On the worksheet, map each responsibility to its file and identify the service's execution call. Include the terminal test result as evidence and explain which behavior each assertion checked.",
        evidence:
          "Music returns the expected entry and learners identify the five module roles.",
      },
    ],
    exercises: [
      {
        title: "Map the responsibilities",
        task: "Assign environment loading, agent definition, timetable access, orchestration and assertions to source files. Trace a Music request.",
        evidence: "A five-row responsibility map and the Music tool result.",
        answer:
          "config.mjs loads environment, agents/club-agent.mjs defines the agent, tools/club.mjs reads data, services/club-service.mjs composes execution and tests/club.test.mjs asserts the local contract. Music is Wednesday at 15:30 in Studio.",
      },
      {
        title: "Execute the focused tests",
        task: "From apps run node --test foundations-runtime/examples/organized/tests/club.test.mjs. Explain both assertions and record the terminal result.",
        evidence: "Two passing tests and a sentence about each contract.",
        answer:
          "The complete robotics entry matches the expected object and an unknown activity throws explicitly. The browser's Tests stage describes this file. The terminal command executes it.",
      },
    ],
    assessment: [
      {
        question: "Which function composes the live request?",
        answer: "askClub in services/club-service.mjs.",
      },
      {
        question: "Where is a missing live credential checked?",
        answer: "loadConfig in config.mjs.",
      },
      {
        question: "What do the focused tests establish?",
        answer:
          "The local robotics timetable contract and rejection of unsupported activities.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 7 and expand How it works.",
        "Open an apps terminal for the focused test command.",
        "Rehearse the five module shortcut buttons and the Music comparison.",
      ],
      misconceptions: [
        "The service connects the modules and returns the SDK result.",
        "A module trace explains architecture, and a test command produces assertion results.",
        "The local tool contract can be checked independently of a live model request.",
      ],
      troubleshooting: [
        "Expand How it works after using a module shortcut if the source panel is collapsed.",
        "Run the focused test command from the apps directory.",
        "Check the printed error and selected app environment if the live configuration fails.",
      ],
      rubric: [
        "1 point for mapping configuration and agent modules",
        "1 point for mapping tool and service modules",
        "1 point for locating the execution call",
        "1 point for explaining both focused test results",
      ],
    },
    references: [
      {
        title: "Official OpenAI Agents SDK quickstart",
        url: "https://developers.openai.com/api/docs/guides/agents/quickstart",
      },
    ],
  },
  {
    number: 8,
    title: "Diagnose a failed agent application",
    concept: "Error evidence, classification and targeted recovery",
    duration: "3 minutes",
    objective:
      "Use an error code and operation to select a recovery path and identify the evidence needed after a retry.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "A terminal for inspecting the suggested commands",
    ],
    execution:
      "Missing-key and incorrect-import scenarios reproduce actual local failures. Authentication, model, rate-limit and registry scenarios inject labeled error fixtures. Recovery commands appear as discussion text. Verify a repair by running the relevant operation again and inspecting its outcome.",
    prediction:
      "Which evidence distinguishes a missing local configuration value from a credential rejected by the API?",
    workflow: [
      {
        title: "Inspect the failure",
        detail: "Read the operation, error code and available HTTP status.",
      },
      {
        title: "Choose a recovery",
        detail: "diagnose maps the observed error to a relevant explanation.",
      },
      {
        title: "Verify the retry",
        detail: "State which successful operation would establish recovery.",
      },
    ],
    scenarios: [
      {
        name: "Incorrect import",
        control: "fault",
        value: "imports",
        action: "Select Incorrect import and run the exercise.",
        expected:
          "An actual local ERR_MODULE_NOT_FOUND is captured. The suggested recovery checks the installed package and import.",
      },
      {
        name: "Missing configuration",
        control: "fault",
        value: "missing",
        action: "Select Missing API key and run again.",
        expected:
          "loadConfig({}) throws MISSING_API_KEY. The diagnosis explains server environment configuration and restart.",
      },
      {
        name: "Rejected credentials",
        control: "fault",
        value: "invalid",
        action:
          "Select Invalid credentials and inspect its fixture label and status.",
        expected:
          "An injected 401 fixture selects the rejected-credential recovery path.",
      },
      {
        name: "Unavailable model",
        control: "fault",
        value: "model",
        action:
          "Select Unavailable model and compare its recovery with authentication.",
        expected:
          "An injected model_not_found fixture with status 404 points to the model identifier and project access.",
      },
      {
        name: "Rate limit",
        control: "fault",
        value: "rate",
        action: "Inspect the rate-limit fixture and its recovery explanation.",
        expected:
          "Status 429 points to rate limits and quota. The diagnosis distinguishes backoff from quota or billing resolution.",
      },
      {
        name: "Installation connectivity",
        control: "fault",
        value: "installation",
        action:
          "Inspect Package installation and read its proposed connectivity checks.",
        expected:
          "An injected ENOTFOUND fixture points to DNS, proxy and registry connectivity before retrying npm ci.",
      },
    ],
    sources: [
      {
        key: "diagnostics.mjs",
        path: "diagnostics.mjs",
        needle: "export function diagnose",
        label: "Error classification and recovery paths",
      },
      {
        key: "config.mjs",
        path: "examples/organized/config.mjs",
        needle: "export function loadConfig",
        label: "Actual local configuration validation",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Scenario selector and execution scope",
        action: "Open prompt 8 and select Incorrect import.",
        speech:
          "We will diagnose a failure using its operation, code and available status. Predict how a missing configuration value differs from a credential rejected by the API. This classroom app reproduces the local configuration and import failures. Other scenarios inject labeled errors. It displays a proposed recovery command so that we can discuss the repair and the evidence a retry would need.",
        evidence:
          "The execution scope identifies actual local failures and injected fixtures.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Import failure evidence",
        action: "Run Incorrect import and expand execution evidence.",
        speech:
          "The application tries importing an intentionally incorrect package name and captures the resulting module error. Read ERR_MODULE_NOT_FOUND in the evidence and locate the suggested import check. Inspect the installed package and the import path before retrying. The example command targets the project's supported SDK package and helps isolate whether module loading succeeds.",
        evidence:
          "The label identifies an actual local import failure and the error code is ERR_MODULE_NOT_FOUND.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Configuration comparison",
        action: "Run Missing API key and inspect config.mjs in How it works.",
        speech:
          "This scenario calls the configuration loader with an empty environment object. The loader throws MISSING_API_KEY before any API request. Locate that check in the source and read the recovery explanation. A restarted server can load a configured value. A successful authenticated request would provide the additional evidence that the service accepts the credential.",
        evidence: "The actual local error code is MISSING_API_KEY.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "HTTP error fixtures",
        action: "Compare Invalid credentials and Unavailable model.",
        speech:
          "The invalid-credential scenario injects a four-oh-one fixture. Its recovery focuses on the credential and project permissions. The unavailable-model scenario injects a four-oh-four model error. Inspect the model identifier and project access for that case. Preserve the fixture label in your recording so learners can distinguish these demonstrations from a response observed during a real request.",
        evidence:
          "The 401 and 404 fixtures select different diagnosis titles and explanations.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Rate and installation scenarios",
        action:
          "Run Rate limit and Package installation, then inspect diagnostics.mjs.",
        speech:
          "A rate-limit fixture leads us to usage, limits and quota. Bounded backoff can address a transient rate limit, while depleted quota needs its own resolution. The registry fixture illustrates a DNS failure, so the suggested checks examine registry connectivity and proxy configuration. Read the matching branches in diagnose and explain how each uses the captured error evidence.",
        evidence:
          "The 429 and ENOTFOUND cases produce targeted recovery explanations.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Recovery worksheet",
        action: "Assign the error matrix and retry-evidence exercise.",
        speech:
          "Build an error matrix with the scenario, code, status, execution label and recovery step. Then choose two cases and state what observation would establish that a retry succeeded. The page gives us an explanation and command text. Record the actual result of an appropriate retry before concluding that a real application has recovered.",
        evidence:
          "Learners distinguish diagnosis output from observed recovery and specify a successful retry check.",
      },
    ],
    exercises: [
      {
        title: "Build an error matrix",
        task: "Run all six scenarios. Record error.code, status where present, the execution label and the diagnosis title.",
        evidence:
          "Six rows that identify which failures execute locally and which use fixtures.",
        answer:
          "imports gives actual ERR_MODULE_NOT_FOUND and missing gives actual MISSING_API_KEY. invalid is an injected 401, model is an injected model_not_found with 404, rate is an injected 429 and installation is injected ENOTFOUND.",
      },
      {
        title: "Define retry evidence",
        task: "Choose an import failure and an API authentication failure. Describe the repair and a concrete observation that would establish successful recovery.",
        evidence: "Two recovery explanations with observable retry outcomes.",
        answer:
          "Correct the package/import and observe a successful import check. Configure the server credential and project permissions, restart as needed, then observe a successful authenticated API request. Displaying the diagnosis alone establishes that the classifier selected a recovery path.",
      },
    ],
    assessment: [
      {
        question: "Which failures actually execute locally?",
        answer:
          "The missing-key validation and intentionally incorrect package import.",
      },
      {
        question: "What does the 404 model fixture suggest inspecting?",
        answer:
          "The configured model identifier and the project's model access.",
      },
      {
        question: "How would you establish that recovery succeeded?",
        answer:
          "Repeat the relevant operation after the repair and inspect its actual successful outcome.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 8 and rehearse all six scenario labels.",
        "Expand the evidence to expose error codes and diagnosis commands.",
        "Keep any actual server environment editor outside the recording frame.",
      ],
      misconceptions: [
        "Missing configuration is detected locally before API authentication.",
        "The HTTP and registry scenarios demonstrate injected errors.",
        "A proposed command describes a recovery action, and an observed retry establishes its outcome.",
      ],
      troubleshooting: [
        "The intentionally incorrect import should fail even with dependencies installed.",
        "Use the server's printed URL if PORT is customized.",
        "Run a chosen recovery command from the directory described by the app's own run guide.",
      ],
      rubric: [
        "1 point for recording codes and available statuses",
        "1 point for identifying local failures and fixtures",
        "1 point for matching targeted recovery paths",
        "1 point for specifying observable retry evidence",
      ],
    },
    references: [
      {
        title: "Official OpenAI API error codes",
        url: "https://developers.openai.com/api/docs/guides/error-codes",
      },
    ],
  },
];
