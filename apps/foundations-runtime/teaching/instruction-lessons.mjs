export const instructionLessons = [
  {
    number: 9,
    title: "Define a specialist's identity",
    concept: "Name, responsibility, boundaries and response style",
    duration: "3 minutes",
    objective:
      "Build a specialist contract and compare relevant, unrelated and underspecified requests against it.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Understanding of an agent definition",
    ],
    execution:
      "Classroom mode builds the identity locally and selects a prepared response. The live service constructs an SDK agent and runs the selected question. SQL statements are teaching examples. configuredTools is empty, and resource access requires application-level permissions and registered tools.",
    prediction:
      "Which configuration fields change when you rename the SQL tutor, and which fields describe its teaching responsibility?",
    workflow: [
      {
        title: "Build the contract",
        detail: "Select a responsibility, boundaries and response style.",
      },
      {
        title: "Test the requests",
        detail: "Compare explanation, redirection and clarification scenarios.",
      },
      {
        title: "Inspect the evidence",
        detail: "Locate name, instructions and configuredTools in the result.",
      },
    ],
    scenarios: [
      {
        name: "SQL teaching question",
        control: "scenario",
        value: "relevant",
        action:
          "Choose SQL tutor, concise style and Relevant question. Run the exercise.",
        expected:
          "The prepared answer explains GROUP BY and an aggregate query. Evidence identifies the SQL responsibility and empty configuredTools.",
      },
      {
        name: "Rename the specialist",
        control: "agentName",
        value: "School SQL tutor",
        action: "Change only the name and repeat the same relevant question.",
        expected:
          "agent.name changes. The generated teaching instructions and prepared answer match the previous trial.",
      },
      {
        name: "Unrelated request",
        control: "scenario",
        value: "unrelated",
        action: "Select Unrelated request and inspect the response.",
        expected:
          "The SQL fixture redirects the newsletter request to a suitable writing specialist.",
      },
      {
        name: "Missing information",
        control: "scenario",
        value: "clarification",
        action: "Select Missing information and run again.",
        expected:
          "The SQL fixture asks for database dialect, table schema and the order-date column.",
      },
      {
        name: "Guided teaching style",
        control: "style",
        value: "guided",
        action: "Return to Relevant question, select Guided lesson and run.",
        expected:
          "The prepared response has numbered teaching steps and a check-for-understanding question.",
      },
    ],
    sources: [
      {
        key: "identity/contract.js",
        path: "public/identity.js",
        needle: "export function buildIdentity",
        label: "Identity builder and generated instructions",
      },
      {
        key: "identity/specialist-agent.mjs",
        path: "examples/identity/specialist-agent.mjs",
        needle: "const agent = new Agent",
        label: "Live SDK specialist configuration",
      },
      {
        key: "identity/run-specialist.mjs",
        path: "examples/identity/run-specialist.mjs",
        needle: "export async function runSpecialist",
        label: "Live specialist execution",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Identity controls",
        action:
          "Open prompt 9 in Classroom with SQL tutor, concise style and Relevant question.",
        speech:
          "We will build a teaching specialist and test its contract. Predict what changes when we rename the tutor. The controls select its responsibility, response style and test scenario. Classroom mode generates the identity locally and chooses a prepared response. Read the current responsibility and boundaries before running the first question.",
        evidence:
          "The contract describes SQL teaching, redirection and clarification behavior.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Relevant answer and execution evidence",
        action: "Run the SQL question and expand the evidence.",
        speech:
          "The prepared answer explains grouping and shows an aggregate query. Compare the answer with the instructions in the evidence. Find agent name, instructions and configured tools. The tool list is empty. This lesson presents SQL teaching examples, while database access would require tools and application permissions. Record the configuration that produced this classroom response.",
        evidence:
          "specialist is sql, scenario is relevant and agent.configuredTools is empty.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Rename comparison",
        action:
          "Rename the agent to School SQL tutor and repeat the relevant question.",
        speech:
          "Change only the display name and run the same question. Inspect the name and instruction text side by side with your first record. The builder uses responsibility, boundaries and style to assemble instructions. Its name identifies the specialist. In these classroom fixtures, the renamed tutor returns the same prepared answer for the same scenario and style.",
        evidence:
          "agent.name changes while instructions and the selected classroom answer match the baseline.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Boundary scenarios",
        action: "Run Unrelated request, then Missing information.",
        speech:
          "The unrelated request asks for a promotional newsletter. Inspect how the fixture describes the SQL teaching role and redirects that request. Next run the underspecified query request. The response asks for a database dialect, relevant schema and ordering column. Use these two trials to connect the written boundary guidance to the intended response behavior.",
        evidence:
          "The fixtures demonstrate redirection and a request for missing query information.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Style and source",
        action:
          "Return to Relevant question, select Guided lesson and inspect identity/contract.js.",
        speech:
          "Switch the same SQL question to guided style. The prepared answer uses teaching steps and ends with a comprehension question. Locate buildIdentity in the source and follow the instruction assembly. Then inspect the SDK factory, which receives that identity and an empty tool list. Evaluate actual live responses against the selected contract when using the live service.",
        evidence:
          "responseStyle is guided and the source composes responsibility, boundaries and style.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student worksheet",
        action: "Assign the rename comparison and scenario matrix.",
        speech:
          "Record the name, instructions and answer for the rename comparison. Then complete a three-scenario matrix covering explanation, redirection and clarification. Identify which source fields guide each response. Finish by describing how you would verify the same expectations in a live run, using its observed output and the configured tool surface.",
        evidence:
          "Learners distinguish the identifier, instruction contract and available capabilities.",
      },
    ],
    exercises: [
      {
        title: "Compare a name change",
        task: "Run a relevant SQL question, record the evidence, rename the tutor and repeat with the same scenario and style. Compare name, instructions and response.",
        evidence: "Two evidence records with the changed field identified.",
        answer:
          "agent.name changes. buildIdentity assembles instructions from responsibility, boundaries and style. The classroom response is selected by specialist, scenario and style, so this rename comparison preserves the prepared answer.",
      },
      {
        title: "Test the specialist contract",
        task: "Run relevant, unrelated and missing-information SQL scenarios. Then repeat the relevant question with guided style. Record the intended behavior and configured tools.",
        evidence: "Four observations linked to the contract and tool list.",
        answer:
          "The SQL fixtures explain GROUP BY, redirect newsletter writing and ask for dialect, schema and the date column. Guided style adds numbered teaching steps and a comprehension question. configuredTools is empty. Database operations require an application tool and its permission checks.",
      },
    ],
    assessment: [
      {
        question: "What does the agent name identify?",
        answer: "The specialist's human-readable identifier.",
      },
      {
        question: "Where are responsibility and response style assembled?",
        answer:
          "buildIdentity composes them into instructions in public/identity.js.",
      },
      {
        question: "What evidence describes this agent's tool surface?",
        answer:
          "agent.configuredTools is empty, and the SDK factory configures tools as an empty array.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 9 with the SQL tutor, concise style and relevant scenario.",
        "Keep a baseline evidence record for the rename comparison.",
        "Rehearse the three scenarios and the guided-style comparison.",
      ],
      misconceptions: [
        "The identifier and instruction text have distinct configuration roles.",
        "Classroom answers demonstrate the intended contract using prepared fixtures.",
        "Resource permissions are enforced by application code and tool access.",
      ],
      troubleshooting: [
        "Use a single-line name between 1 and 60 characters.",
        "Changing a control resets the displayed result. Run the selected trial again.",
        "For live questions, configure the selected app's environment and inspect the actual response against its contract.",
      ],
      rubric: [
        "1 point for comparing name and instructions",
        "1 point for testing relevant and unrelated requests",
        "1 point for checking clarification and style",
        "1 point for identifying configured capabilities",
      ],
    },
    references: [
      {
        title: "Official OpenAI agent definitions",
        url: "https://developers.openai.com/api/docs/guides/agents/define-agents",
      },
    ],
  },
  {
    number: 10,
    title: "Build a complete instruction set",
    concept:
      "Goal, available information, permitted actions and completion criteria",
    duration: "3 minutes",
    objective:
      "Compare a complete workshop-planning contract with a goal-only configuration using the same request.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Completion of the specialist identity exercise",
    ],
    execution:
      "Classroom mode constructs the SDK agent and selects an illustrative response for the instruction set and request. Live mode runs that agent with the configured model. Inspect the generated instructions and observed result together when assessing behavior.",
    prediction:
      "How should the complete contract handle a request that omits the audience and duration?",
    workflow: [
      {
        title: "Assemble instructions",
        detail:
          "Inspect the goal, information, actions and completion sections.",
      },
      {
        title: "Hold the request fixed",
        detail:
          "Compare complete and goal-only instructions on an underspecified request.",
      },
      {
        title: "Check completion",
        detail:
          "Identify the information required before proposing a timed plan.",
      },
    ],
    scenarios: [
      {
        name: "Complete workshop request",
        control: "request",
        value: "complete",
        action:
          "Select the complete instruction set and Beginners · 30 minutes. Run the exercise.",
        expected:
          "Four sections are included. The prepared plan contains 5, 20 and 5 minute activities and materials.",
      },
      {
        name: "Missing requirements",
        control: "request",
        value: "missing",
        action:
          "Keep complete instructions and select Audience and duration missing.",
        expected:
          "The prepared response asks for both missing requirements before proposing the plan.",
      },
      {
        name: "Goal-only comparison",
        control: "instructionSet",
        value: "goal-only",
        action:
          "Keep the same missing-information request and switch instructions to Goal only.",
        expected:
          "includedSections contains goal. The fixture gives general workshop suggestions. The question matches the preceding trial.",
      },
    ],
    sources: [
      {
        key: "definitions/builders.js",
        path: "public/definitions.js",
        needle: "export function designInstructions",
        label: "Four-section instruction builder",
      },
      {
        key: "definitions/instruction-design.mjs",
        path: "examples/definitions/instruction-design.mjs",
        needle: "export function createPlanningAgent",
        label: "SDK planning-agent factory",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Instruction and request controls",
        action:
          "Open prompt 10 with complete instructions and Beginners · 30 minutes.",
        speech:
          "We will inspect four instruction sections and compare two configurations. Predict how a complete contract should handle a request with missing requirements. The application constructs the SDK agent locally. Classroom responses illustrate the selected cases. Begin by reading the complete instruction preview and identifying its goal, available information, permitted actions and completion criteria.",
        evidence: "The preview contains all four sections.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Complete-request result",
        action:
          "Run the complete workshop request and expand execution evidence.",
        speech:
          "Inspect the complete request in the evidence. It supplies beginners as the audience and thirty minutes as the duration. The prepared plan allocates five minutes to introduction, twenty to building and testing, and five to discussion. Check that the activities add up to the requested duration and that the result includes materials.",
        evidence:
          "includedSections lists goal, information, actions and completion. The plan totals 30 minutes.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Missing-information request",
        action:
          "Keep complete instructions and select Audience and duration missing. Run again.",
        speech:
          "This request supplies the workshop topic while leaving the audience and duration unspecified. The complete contract directs the planner to request those requirements before proposing the plan. Read the classroom response and connect its clarification question to the completion section. Save this request and response as the first half of a controlled comparison.",
        evidence:
          "The response asks who will attend and how long the workshop should last.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Goal-only comparison",
        action: "Keep the missing-information request and switch to Goal only.",
        speech:
          "Change the instruction set while preserving the same request. The evidence now lists only the goal section. The prepared response supplies general workshop suggestions. Compare the instruction text and question across the two trials. This classroom pair illustrates the intended distinction. Actual model behavior can be assessed by repeating the paired requests through the live path.",
        evidence:
          "The question matches the previous trial and includedSections contains only goal.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Instruction builder and SDK source",
        action:
          "Expand How it works and inspect definitions/builders.js and instruction-design.mjs.",
        speech:
          "Find designInstructions and read the four section values. The selection determines which text reaches the agent. Follow createPlanningAgent to see those instructions passed to the SDK constructor. The available-information section supplies classroom resources, and the action and completion sections specify how to proceed when requirements are missing. Locate each of these responsibilities in the source.",
        evidence:
          "The builder returns the selected instructions and the factory passes them to new Agent.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student comparison",
        action:
          "Assign the paired missing-information trials and completion checklist.",
        speech:
          "Submit both evidence records for the same underspecified request. Mark the instruction sections included in each configuration and explain the illustrated responses. Then inspect the complete workshop result against a checklist for audience, duration, timed activities and materials. State which observations came from prepared classroom answers and which came from local agent construction.",
        evidence:
          "Learners connect selected sections, a fixed request and the completion checklist.",
      },
    ],
    exercises: [
      {
        title: "Compare the same request",
        task: "Use Audience and duration missing for both complete and goal-only instructions. Record question, includedSections and response for each trial.",
        evidence: "A paired comparison with identical questions.",
        answer:
          "Complete instructions include all four sections and the fixture asks for audience and duration. Goal-only instructions contain goal and the fixture supplies general suggestions. Both records use the same request. modelOutputIsScripted is true in Classroom.",
      },
      {
        title: "Check the finished plan",
        task: "Run complete instructions with Beginners · 30 minutes. Check audience, activity timing and materials, then locate the source section that defines completion.",
        evidence: "A completion checklist with a source reference.",
        answer:
          "The prepared plan targets beginners, allocates 5 + 20 + 5 minutes and lists robotics kits and projector. The completion section in designInstructions requests a title, timed activities and materials once audience and duration are known.",
      },
    ],
    assessment: [
      {
        question: "What four sections appear in the complete configuration?",
        answer:
          "Goal, available information, permitted actions and completion criteria.",
      },
      {
        question: "What stays fixed in the paired comparison?",
        answer: "The same missing-audience-and-duration request.",
      },
      {
        question: "What identifies the classroom response's execution scope?",
        answer:
          "modelOutputIsScripted is true, alongside evidence of the locally constructed agent instructions.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 10 with the complete configuration.",
        "Expand the instruction preview and execution evidence.",
        "Keep the missing-information request selected while changing instruction sets.",
      ],
      misconceptions: [
        "The selected instruction text reaches the agent factory.",
        "The request and instruction set are separate inputs to the comparison.",
        "Prepared outputs illustrate scenarios. Live outputs supply observations for model-behavior assessment.",
      ],
      troubleshooting: [
        "Run again after changing either selector.",
        "Check includedSections and question when comparing saved results.",
        "For live assessment, inspect the actual response against the same completion checklist.",
      ],
      rubric: [
        "1 point for naming the four sections",
        "1 point for holding the request fixed",
        "1 point for connecting clarification to completion",
        "1 point for identifying execution scope",
      ],
    },
    references: [
      {
        title: "Official OpenAI agent definitions",
        url: "https://developers.openai.com/api/docs/guides/agents/define-agents",
      },
    ],
  },
  {
    number: 11,
    title: "Compare instructions with examples",
    concept: "Labeled examples, category vocabulary and paired ticket inputs",
    duration: "3 minutes",
    objective:
      "Inspect a baseline and an example-guided classifier using the same ticket, and identify all instruction changes in the comparison.",
    prerequisites: [
      "Node.js 24 or later",
      "The course workspace with npm dependencies installed",
      "Understanding of instruction sets and paired comparisons",
    ],
    execution:
      "Classroom mode constructs two SDK agents and displays prepared before-and-after responses. The after configuration adds an explicit category vocabulary and three labeled examples. Live mode makes two independent model runs on the same ticket. The evidence supports manual comparison of the returned outputs.",
    prediction:
      "Which instruction changes appear in the after configuration, and which ticket is sent to both classifiers?",
    workflow: [
      {
        title: "Inspect both prompts",
        detail:
          "Read the baseline, category vocabulary and three input/output pairs.",
      },
      {
        title: "Use the same ticket",
        detail: "Compare both responses for each selected test case.",
      },
      {
        title: "Record observations",
        detail:
          "Check category meaning and output shape against the displayed instructions.",
      },
    ],
    scenarios: [
      {
        name: "Login problem",
        control: "ticket",
        value: "login",
        action: "Run Login problem and expand both instruction records.",
        expected:
          "The prepared baseline is Account trouble and the after response is access. Both use the same login question.",
      },
      {
        name: "Duplicate payment",
        control: "ticket",
        value: "payment",
        action: "Run Duplicate payment and compare the two responses.",
        expected:
          "The prepared baseline is Payment problem and the after response is billing.",
      },
      {
        name: "Application crash",
        control: "ticket",
        value: "crash",
        action: "Run Application crash and compare against the allowed labels.",
        expected:
          "The prepared baseline is Application issue and the after response is technical.",
      },
    ],
    sources: [
      {
        key: "definitions/builders.js",
        path: "public/definitions.js",
        needle: "export function exampleInstructions",
        label: "Baseline, vocabulary and example assembly",
      },
      {
        key: "definitions/example-instructions.mjs",
        path: "examples/definitions/example-instructions.mjs",
        needle: "export function createTicketAgents",
        label: "Two SDK classifier definitions",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Ticket selector and examples",
        action:
          "Open prompt 11 in Classroom and expand Inspect the three examples.",
        speech:
          "We will inspect two classifier configurations using paired ticket inputs. Predict which prompt changes appear in the after configuration. Read the three labeled examples for billing, access and technical requests. Classroom mode constructs both agents and shows prepared responses. The live path runs each configured agent independently on the selected ticket.",
        evidence: "Three example input/output pairs appear in the preview.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Login comparison",
        action: "Run Login problem and expand execution evidence.",
        speech:
          "The login ticket is the shared input for this pair. Read the baseline output, Account trouble, and the after output, access. Inspect both instruction strings in the evidence. The after string adds an explicit allowed-label rule as well as the three examples. Record both changes when describing what this comparison demonstrates.",
        evidence:
          "The evidence includes one shared question, both instruction strings and both responses.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Payment and crash comparisons",
        action: "Run Duplicate payment, then Application crash.",
        speech:
          "Repeat the paired comparison with the payment and crash tickets. The prepared after labels are billing and technical. Compare the category meanings and response shapes for each pair. Record the selected question and both outputs so that another learner can reproduce your observations. Keep the distinction between prepared classroom examples and observed live model responses visible.",
        evidence:
          "payment maps to billing and crash maps to technical in the after fixtures.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Instruction-builder source",
        action: "Expand How it works and open definitions/builders.js.",
        speech:
          "Find exampleInstructions and follow how it assembles the after prompt. It starts with the baseline, adds the category rule and then formats three input/output pairs. Locate ticketExamples near the top of the file. The evaluation tickets use different wording from those examples. Explain which instruction details tell the classifier what labels and output shape to use.",
        evidence:
          "The builder adds the exact category vocabulary and formats all three example pairs.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "SDK agents and comparison evidence",
        action:
          "Open definitions/example-instructions.mjs and inspect createTicketAgents.",
        speech:
          "The factory constructs a before agent and an after agent with the selected model. Each receives its own instruction string. The live implementation sends the same test ticket to both and returns their outputs for manual inspection. In the classroom evidence, modelOutputIsScripted is true. Use that field when documenting where each response came from.",
        evidence:
          "The factory calls new Agent twice and the evidence identifies scripted classroom output.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student comparison matrix",
        action: "Assign the three-ticket matrix and instruction-change audit.",
        speech:
          "Submit a row for login, payment and crash with the shared question and both responses. Then list every difference between the two instruction strings. Explain what the prepared outputs illustrate about category meaning and formatting. A behavior assessment should identify its actual inputs, returned responses and judging criteria so another learner can verify the conclusion.",
        evidence:
          "Learners report paired observations and identify both the vocabulary rule and examples.",
      },
    ],
    exercises: [
      {
        title: "Compare three ticket pairs",
        task: "Run login, payment and crash. Record each shared question, baseline output, after output and whether the after label belongs to the supplied vocabulary.",
        evidence: "A three-row comparison matrix.",
        answer:
          "The after fixtures are access, billing and technical, paired with Account trouble, Payment problem and Application issue. Each before/after pair uses the selected ticket's same question.",
      },
      {
        title: "Audit the instruction changes",
        task: "Compare before.instructions and after.instructions. Identify the added label rule and examples, then explain what the classroom evidence establishes.",
        evidence:
          "An instruction-change list linked to the source and execution flag.",
        answer:
          "The after prompt adds an explicit one-label vocabulary rule and three labeled examples. The fixtures illustrate the configured responses, and modelOutputIsScripted is true. A live assessment uses observed outputs and stated comparison criteria.",
      },
    ],
    assessment: [
      {
        question: "What stays the same within each pair?",
        answer: "The selected ticket question and the configured model.",
      },
      {
        question: "What changes in the after instructions?",
        answer:
          "An explicit category vocabulary and three labeled input/output examples are added.",
      },
      {
        question:
          "How many independent runs does a completed live comparison make?",
        answer: "Two, one for the baseline agent and one for the after agent.",
      },
    ],
    instructor: {
      preparation: [
        "Start prompt 11 and expand the three-example preview.",
        "Rehearse login, payment and crash comparisons.",
        "Keep both instruction strings visible when explaining the changed configuration.",
      ],
      misconceptions: [
        "The after configuration changes both the category rule and the examples.",
        "Each pair uses the same selected test question.",
        "Classroom fixtures illustrate the comparison, and live results require manual assessment against stated criteria.",
      ],
      troubleshooting: [
        "Run again after selecting another ticket.",
        "Expand execution evidence to inspect the shared question and both prompts.",
        "If a live comparison fails after its first run, inspect the returned failure and repeat only when ready to perform the comparison again.",
      ],
      rubric: [
        "1 point for recording all three ticket pairs",
        "1 point for identifying the shared input",
        "1 point for finding both instruction changes",
        "1 point for explaining the execution flag and assessment criteria",
      ],
    },
    references: [
      {
        title: "Official OpenAI prompt engineering guide",
        url: "https://developers.openai.com/api/docs/guides/prompt-engineering",
      },
    ],
  },
];
