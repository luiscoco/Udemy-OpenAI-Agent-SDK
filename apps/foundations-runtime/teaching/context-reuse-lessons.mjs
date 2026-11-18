export const contextReuseLessons = [
  {
    number: 12,
    title: "Resolve instructions from local context",
    concept: "Per-run context and an SDK instructions callback",
    duration: "3 minutes",
    objective:
      "Trace selected context values into resolved instructions and compare which fields the callback includes.",
    prerequisites: [
      "Node.js 24 or later",
      "Installed course dependencies",
      "Understanding of static agent instructions",
    ],
    execution:
      "The installed SDK resolves an actual instructions callback locally. Classroom answers are prepared fixtures. localContext contains userId, displayName, language and application. The callback includes displayName, language and application in the model instructions. Live execution uses the selected context in an actual SDK run.",
    prediction:
      "Which local context fields will appear in the resolved instruction string?",
    workflow: [
      {
        title: "Prepare local context",
        detail: "Choose a sample user, language and application.",
      },
      {
        title: "Resolve the callback",
        detail: "The SDK supplies RunContext to the instruction function.",
      },
      {
        title: "Compare visibility",
        detail: "Inspect localContext and resolvedInstructions together.",
      },
    ],
    scenarios: [
      {
        name: "English homework",
        control: "responseLanguage",
        value: "English",
        action: "Choose Ada, English and Homework. Run and expand evidence.",
        expected:
          "The resolved string teaches Ada in English for a homework exercise. userId stays in localContext.",
      },
      {
        name: "Language comparison",
        control: "responseLanguage",
        value: "Spanish",
        action:
          "Keep Ada and Homework fixed, change language to Spanish and run again.",
        expected:
          "The callback's language changes and the prepared response is Spanish. The selected user and application are held fixed.",
      },
      {
        name: "Different user and application",
        control: "application",
        value: "workshop",
        action: "Choose Luis and Workshop with Spanish selected.",
        expected:
          "Resolved instructions name Luis and a teacher-led workshop. The classroom answer follows that context.",
      },
    ],
    sources: [
      {
        key: "definitions/dynamic-instructions.mjs",
        path: "examples/definitions/dynamic-instructions.mjs",
        needle: "export function createDynamicAgent",
        label: "SDK agent and callback resolution",
      },
      {
        key: "definitions/builders.js",
        path: "public/definitions.js",
        needle: "export function dynamicInstructions",
        label: "Fields included by the callback",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Context controls",
        action: "Open prompt 12 with Ada, English and Homework selected.",
        speech:
          "An instruction callback can adapt a tutor to the current request context. Predict which fields will appear in its resolved text. Select Ada, English and homework. This lesson uses the installed SDK to resolve the callback locally. The classroom response is a prepared illustration of the selected context.",
        evidence: "The three context selectors show the baseline values.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Resolved instructions and local context",
        action: "Run the baseline and expand execution evidence.",
        speech:
          "Read localContext and resolvedInstructions side by side. The local object contains a user identifier, display name, language and application. The resolved string includes Ada, English and a homework exercise. Identify exactly which fields the function selected and compare them with the full local object.",
        evidence:
          "userId is listed in localOnlyFieldsInThisExample. The other three fields appear in modelVisibleFieldsInInstructions.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Controlled language comparison",
        action: "Change only Response language to Spanish and rerun.",
        speech:
          "Keep the user and application fixed while changing the language. Compare the two resolved instruction strings. The callback now selects Spanish, and the classroom fixture gives the corresponding response. Record this pair so you can explain which input changed and which parts of the request stayed fixed.",
        evidence:
          "The user remains Ada and the application remains homework while the language changes.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "User and application comparison",
        action: "Select Luis and Workshop, keeping Spanish selected.",
        speech:
          "Now change the user and application to Luis and workshop. Inspect the newly resolved string before reading the answer. It names Luis and the teacher-led workshop. The context is assembled for this request, so the evidence can be used to trace the values selected for each individual run.",
        evidence:
          "Resolved instructions include Luis, Spanish and a teacher-led workshop.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Callback source",
        action: "Open dynamic-instructions.mjs and definitions/builders.js.",
        speech:
          "The agent factory assigns a function to instructions. The local resolver constructs RunContext and calls the agent's system-prompt resolution method. In the builder, follow the callback's selection of display name, language and application. Those selected values form the resulting instruction text. Use the source to justify your visibility map.",
        evidence:
          "The source contains instructions: dynamicInstructions and agent.getSystemPrompt(new sdk.RunContext(context)).",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student visibility map",
        action: "Assign the context-field map and language comparison.",
        speech:
          "Submit a map of the local fields and the values included in the resolved instructions. Attach the English and Spanish trials with the same user and application. Explain which parts of this demonstration execute through the SDK locally and which answer text comes from the classroom fixture.",
        evidence:
          "Learners distinguish local state, selected instruction content and response execution scope.",
      },
    ],
    exercises: [
      {
        title: "Map context visibility",
        task: "Run Ada, English and Homework. Map all four localContext fields to their presence in resolvedInstructions and locate the callback that selects them.",
        evidence: "A four-row field map and source reference.",
        answer:
          "displayName, language and application are explicitly included by dynamicInstructions. userId stays in the local context in this example.",
      },
      {
        title: "Hold two context fields fixed",
        task: "Compare English and Spanish with Ada and Homework fixed. Record resolvedInstructions and the classroom output, then explain the execution flag.",
        evidence:
          "Two comparable records and an explanation of modelOutputIsScripted.",
        answer:
          "The callback changes its language value while user and application stay fixed. SDK resolution executes locally and modelOutputIsScripted is true for the prepared classroom answers.",
      },
    ],
    assessment: [
      {
        question: "Which SDK wrapper supplies the local context?",
        answer: "RunContext supplies the callback's context object.",
      },
      {
        question: "How do selected local values become instruction content?",
        answer:
          "The callback explicitly incorporates them in the returned string.",
      },
      {
        question: "What does the classroom fixture flag describe?",
        answer:
          "The answer is prepared while the SDK callback resolution actually executes locally.",
      },
    ],
    instructor: {
      preparation: [
        "Start with Ada, English and Homework.",
        "Expand evidence to compare local and resolved values.",
        "Keep a baseline record before changing one selector.",
      ],
      misconceptions: [
        "The callback selects the values placed in instructions.",
        "Local state and resolved instruction content have distinct roles.",
        "An actual local callback resolution and a prepared answer are both identified in the evidence.",
      ],
      troubleshooting: [
        "Run again after changing a selector.",
        "Inspect resolvedInstructions if the answer's language seems unexpected.",
        "Configure the selected app's environment before using its live path.",
      ],
      rubric: [
        "1 point for mapping the four fields",
        "1 point for locating callback resolution",
        "1 point for holding the comparison inputs fixed",
        "1 point for explaining the fixture flag",
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
    number: 13,
    title: "Version prompts in application code",
    concept: "Versioned builders, variables and hosted-prompt migration",
    duration: "3 minutes",
    objective:
      "Compare prompt versions and language values in application code and identify the migration role of the legacy reference.",
    prerequisites: [
      "Node.js 24 or later",
      "Installed course dependencies",
      "Understanding of agent instructions and paired comparisons",
    ],
    execution:
      "The default application-code path constructs an SDK agent using the selected prompt builder. Classroom outputs are prepared fixtures. The legacy selector inspects a placeholder reference locally. Official guidance schedules reusable hosted prompt objects to shut down November 30, 2026 and directs prompt content into application code.",
    prediction:
      "What changes between prompt versions 1 and 2 when the language and delivery facts are held fixed?",
    workflow: [
      {
        title: "Choose a code version",
        detail: "Build instructions from the selected version and language.",
      },
      {
        title: "Compare the responses",
        detail:
          "Inspect short-answer and bullet-point instructions on the same facts.",
      },
      {
        title: "Trace the migration",
        detail:
          "Connect the legacy reference to the application-owned instruction builder.",
      },
    ],
    scenarios: [
      {
        name: "Code version 1",
        control: "version",
        value: "1",
        action: "Choose Versioned application code, Version 1 and English.",
        expected:
          "Evidence contains version 1, an English language value and short-answer instructions.",
      },
      {
        name: "Code version 2",
        control: "version",
        value: "2",
        action:
          "Keep English and application code fixed, then select Version 2.",
        expected:
          "Instructions request a heading, bullet points and a preference question. Delivery facts retain the same values.",
      },
      {
        name: "Spanish variable",
        control: "responseLanguage",
        value: "Spanish",
        action: "Keep Version 2 and change the language value.",
        expected:
          "The code builder incorporates Spanish and the prepared response uses Spanish.",
      },
      {
        name: "Legacy migration reference",
        control: "storage",
        value: "hosted",
        action:
          "Inspect the legacy reference in Classroom, then return to Versioned application code.",
        expected:
          "The placeholder reference identifies a prompt ID, version and language variable. The application-code path supplies its generated instructions directly.",
      },
    ],
    sources: [
      {
        key: "definitions/versioned-prompts.mjs",
        path: "examples/definitions/versioned-prompts.mjs",
        needle: "export function createVersionedAgent",
        label: "Code path and legacy reference comparison",
      },
      {
        key: "definitions/builders.js",
        path: "public/definitions.js",
        needle: "export function versionedInstructions",
        label: "Version and language instruction builder",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Code prompt selectors",
        action:
          "Open prompt 13 with Versioned application code, Version 1 and English.",
        speech:
          "We will manage prompt content through application code and compare two versions. Predict which response requirements change between versions. The default path builds instructions locally and constructs the SDK agent. Classroom answers are prepared fixtures, so we can repeat this demonstration with the same delivery facts.",
        evidence: "The default storage value is versioned application code.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Version 1 evidence",
        action: "Run the baseline and inspect its instructions and variables.",
        speech:
          "Version one requests a brief explanation in the selected language. Read the version, language value and generated instructions in the evidence. The classroom facts give standard delivery as three to five days, express as one to two days, and collection at the school office. Record these values for the comparison.",
        evidence:
          "Evidence identifies version 1, English and generated instructions.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Version 2 comparison",
        action: "Change only Prompt version to Version 2 and run.",
        speech:
          "Version two requests a heading, three concise bullet points and a preference question. Keep the language and facts fixed while comparing the instruction strings. The prepared answer illustrates the new response shape. Record both versions so another learner can reproduce the same configuration and inspect the requested change.",
        evidence:
          "The after instructions request a heading, three bullets and a preference question.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Language variable and builder",
        action:
          "Select Spanish, run again and inspect versionedInstructions in the source.",
        speech:
          "Change the language value to Spanish while keeping version two. Locate the builder that validates the version and language, then returns instruction text. The code-owned helper makes these inputs visible alongside the prompt content. Follow the factory's application-code branch to see those instructions passed into the SDK agent definition.",
        evidence:
          "The evidence includes Spanish and the factory passes prompt.instructions to the Agent constructor.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Legacy reference and migration",
        action:
          "Inspect the legacy Classroom reference and the linked official migration guide, then return to code storage.",
        speech:
          "The legacy option illustrates the installed SDK's prompt reference using a local placeholder. Official guidance schedules reusable hosted prompt objects to shut down on November thirtieth, twenty twenty-six. The migration places prompt content in application code and makes dynamic values explicit. This lesson's default code path demonstrates that approach through its versioned builder.",
        evidence:
          "classroomReferenceIsPlaceholder is true in the legacy fixture. Code storage includes generated instructions.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student version comparison",
        action: "Assign the version matrix and migration map.",
        speech:
          "Submit version one and version two with English held fixed, followed by a Spanish version-two trial. Identify the instruction changes and the facts that stayed fixed. Then map the legacy prompt reference to the code builder, explicit inputs and resulting agent instructions. Link your explanation to the current migration guide.",
        evidence:
          "Learners distinguish code versioning, dynamic input values and the legacy migration reference.",
      },
    ],
    exercises: [
      {
        title: "Compare code versions",
        task: "Run code versions 1 and 2 in English with the same delivery facts. Record the instructions, language and requested response shape.",
        evidence: "A two-row version comparison.",
        answer:
          "Version 1 requests a short answer. Version 2 requests a heading, three bullets and a preference question. Both use English and the same standard, express and collection facts.",
      },
      {
        title: "Map the migration",
        task: "Inspect the local legacy reference, return to code storage and identify the builder, version input, language value and SDK instruction field. Check the linked migration guidance.",
        evidence: "A migration map and the source lines used.",
        answer:
          "The legacy reference contains prompt identity, version and variables. The application path selects versionedInstructions and places its generated text into Agent.instructions. The legacy classroom ID is a placeholder. Official guidance moves prompt content into application code.",
      },
    ],
    assessment: [
      {
        question: "Which path is selected by default?",
        answer: "Versioned application code.",
      },
      {
        question: "Which values should be held fixed when comparing versions?",
        answer: "The language and the delivery facts supplied by the question.",
      },
      {
        question: "Where is the prompt text owned in the migration path?",
        answer: "The application code's versioned instruction helper.",
      },
    ],
    instructor: {
      preparation: [
        "Start with application code, version 1 and English.",
        "Check the official migration timeline before delivering a future recording.",
        "Use the local placeholder to explain the legacy reference and return to the code path for the main exercise.",
      ],
      misconceptions: [
        "Code versions and language values are separate inputs.",
        "The legacy classroom reference is identified as a placeholder in the evidence.",
        "The code path provides the generated instructions directly to the SDK agent.",
      ],
      troubleshooting: [
        "Run again after changing a selector.",
        "Inspect storage and instructions when comparing saved evidence.",
        "Use the application-code exercise for the current course workflow. Legacy account resources depend on service availability.",
      ],
      rubric: [
        "1 point for comparing versions with fixed inputs",
        "1 point for identifying the response-shape change",
        "1 point for tracing the language value",
        "1 point for mapping the migration to code",
      ],
    },
    references: [
      {
        title: "Official migration from prompt objects",
        url: "https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object",
      },
    ],
  },
  {
    number: 14,
    title: "Create tutor variants from a base agent",
    concept: "SDK clone, explicit overrides and configuration reuse",
    duration: "3 minutes",
    objective:
      "Inspect an actual SDK clone and compare the base configuration with concise and guided tutor variants.",
    prerequisites: [
      "Node.js 24 or later",
      "Installed course dependencies",
      "Understanding of agent definitions and instruction styles",
    ],
    execution:
      "The installed SDK constructs a base Agent and calls clone with explicit overrides. Evidence compares the actual base and clone configurations. Classroom answers are prepared fixtures. Live mode runs the selected clone through the configured model.",
    prediction:
      "Which configuration values are overridden in the clone, and what evidence identifies it as a distinct object?",
    workflow: [
      {
        title: "Define a reusable base",
        detail: "Read the shared AI teaching instructions.",
      },
      {
        title: "Clone with overrides",
        detail: "Choose a concise or guided name and response style.",
      },
      {
        title: "Inspect both objects",
        detail:
          "Compare base instructions, clone instructions and object identity.",
      },
    ],
    scenarios: [
      {
        name: "Concise tutor",
        control: "variant",
        value: "concise",
        action: "Run Concise tutor and inspect the base and clone records.",
        expected:
          "The clone is Concise AI tutor, its instructions add a two-sentence style, and distinctAgentObjects is true.",
      },
      {
        name: "Guided tutor",
        control: "variant",
        value: "guided",
        action: "Select Guided tutor and repeat the same AI-agent question.",
        expected:
          "The clone is Guided AI tutor and its instructions add numbered steps and a question. The base instruction evidence matches the baseline.",
      },
    ],
    sources: [
      {
        key: "definitions/reusable-agents.mjs",
        path: "examples/definitions/reusable-agents.mjs",
        needle: "export function createTutorVariant",
        label: "Base definition and SDK clone call",
      },
    ],
    narration: [
      {
        start: "00:00",
        end: "00:30",
        screen: "Tutor variant selector",
        action: "Open prompt 14 with Concise tutor selected.",
        speech:
          "A reusable base can supply the shared teaching responsibility for several tutor variants. Predict which configuration values will be overridden by a clone. This lesson constructs the base agent and calls the installed SDK's clone method. Classroom answers illustrate the selected response styles while the configuration comparison uses actual objects.",
        evidence: "The variant selector shows Concise tutor.",
      },
      {
        start: "00:30",
        end: "01:00",
        screen: "Concise configuration evidence",
        action: "Run and expand evidence to inspect base and clone.",
        speech:
          "Read the base name and shared teaching instruction. The concise clone has its own name and adds a two-sentence response requirement. Find distinctAgentObjects in the evidence. That value comes from comparing the actual constructed objects. Record the base and clone instructions before switching to the other variant.",
        evidence:
          "distinctAgentObjects is true and the clone name is Concise AI tutor.",
      },
      {
        start: "01:00",
        end: "01:30",
        screen: "Guided variant comparison",
        action: "Select Guided tutor and run again.",
        speech:
          "The guided variant uses the same teaching question and shared base responsibility. Its override adds three numbered steps and a final question. Compare the two clone instruction strings and their prepared answers. Identify exactly which style requirements changed while the shared teaching instruction and question stayed fixed.",
        evidence:
          "The guided clone adds numbered teaching steps and a final question.",
      },
      {
        start: "01:30",
        end: "02:00",
        screen: "Base after cloning",
        action:
          "Compare baseInstructionsAfterClone with the base instruction record.",
        speech:
          "Inspect the base instructions recorded after cloning. They match the base definition supplied by the factory. This gives us an observed check of the factory's behavior. The evidence also describes how to handle mutable configuration when variants need independent values. In this example, the factory explicitly supplies a separate tool array for the clone.",
        evidence:
          "baseInstructionsAfterClone equals base.instructions and the source supplies tools arrays explicitly.",
      },
      {
        start: "02:00",
        end: "02:30",
        screen: "Clone implementation",
        action:
          "Expand How it works and locate base.clone in reusable-agents.mjs.",
        speech:
          "Follow the source from the base constructor to the style selection and clone call. The overrides supply a name, instruction text and tool array. Both definitions use the selected model. The live execution path runs the chosen specialized agent. Use these lines to explain how configuration reuse and explicit customization fit together.",
        evidence:
          "The source calls base.clone with name, instructions and tools overrides.",
      },
      {
        start: "02:30",
        end: "03:00",
        screen: "Student configuration diff",
        action: "Assign the two-variant comparison and source explanation.",
        speech:
          "Submit a configuration comparison for the concise and guided variants, including each name and instruction string. Record the distinct-object flag and the base instruction check. Explain which conclusions follow from local SDK construction and which answer observations come from classroom fixtures. Use the source to justify the overrides you identified.",
        evidence:
          "Learners connect actual object evidence, explicit overrides and response execution scope.",
      },
    ],
    exercises: [
      {
        title: "Compare two variants",
        task: "Run concise and guided tutors. Record base and clone names, instructions and distinctAgentObjects for both.",
        evidence:
          "Two configuration records with the style differences highlighted.",
        answer:
          "Both base records use AI tutor base. The clones are Concise AI tutor and Guided AI tutor. The style suffixes request two sentences or three numbered steps and a question. distinctAgentObjects is true.",
      },
      {
        title: "Explain the override call",
        task: "Locate base.clone, list its explicit overrides and compare baseInstructionsAfterClone with base.instructions.",
        evidence:
          "A source reference and an equality check of the base instruction values.",
        answer:
          "The factory overrides name, instructions and tools. The recorded base instructions after cloning match the base instruction record. Each construction uses explicit tool arrays.",
      },
    ],
    assessment: [
      {
        question: "Which method creates the variant?",
        answer: "base.clone with explicit configuration overrides.",
      },
      {
        question: "What identifies distinct agent objects?",
        answer:
          "distinctAgentObjects is true in the actual configuration evidence.",
      },
      {
        question: "Which text defines the shared responsibility?",
        answer: "The base instructions explain AI agent concepts to beginners.",
      },
    ],
    instructor: {
      preparation: [
        "Start with Concise tutor.",
        "Expand evidence to expose both configurations.",
        "Keep the source clone call visible when discussing customization.",
      ],
      misconceptions: [
        "The clone is a distinct agent configuration object.",
        "The factory supplies explicit overrides and separate tool arrays.",
        "The actual configuration comparison and prepared classroom answers have separate evidence fields.",
      ],
      troubleshooting: [
        "Run again after switching variants.",
        "Inspect clone.instructions when comparing response styles.",
        "Use the selected app's configured live path to observe actual model responses.",
      ],
      rubric: [
        "1 point for comparing names and instructions",
        "1 point for locating the clone method",
        "1 point for checking object identity and base instructions",
        "1 point for explaining explicit configuration overrides",
      ],
    },
    references: [
      {
        title: "Official OpenAI agent definitions",
        url: "https://developers.openai.com/api/docs/guides/agents/define-agents",
      },
    ],
  },
];
