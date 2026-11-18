# Prompt 84 — MCP authentication

Authenticate to a private MCP server while keeping credentials outside model-visible content.

Each exercise creates a private loopback MCP server with an ephemeral bearer credential. The credential stays in the transport. Invalid or missing headers are rejected before tool discovery.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:84
```

Open http://127.0.0.1:3184. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

The private MCP server creates an ephemeral random bearer credential for this exercise. Valid, invalid and missing credential options exercise the transport. Real production authentication would obtain the credential from your application configuration or OAuth flow. The exercise verifies its absence from classroom model requests.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-084-mcp-authentication"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
