# Prompt 82 — Remote MCP

Connect to an MCP server using Streamable HTTP and demonstrate a successful tool call.

A real separate loopback HTTP server responds to MCP initialization, discovery and tool requests. The SDK makes the tool call through Streamable HTTP and closes the client and server.

## Run in Windows Terminal

Requires Node.js 24 or later and the installed shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:82
```

Open http://127.0.0.1:3182. Use the scenario selectors, source explorer, execution evidence and knowledge check. Classroom mode works without API credentials.

For live inference, copy .env.example to .env in this application's folder, configure OPENAI_API_KEY and an accessible compatible OPENAI_MODEL, then restart. Model choices can vary. Hosted features require the appropriate model and account support.

## Record the walkthrough

```powershell
cd ".\apps\prompt-082-remote-mcp"
npm run record
```

The recorder saves a WebM and final-frame PNG under recordings. Generated images, screenshots and CSV files are stored in apps/.runtime/lesson-artifacts and served through the local application.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
