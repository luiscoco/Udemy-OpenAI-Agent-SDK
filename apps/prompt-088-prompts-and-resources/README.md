# Prompt 88 — Prompts and resources

Demonstrate supported MCP prompts and resources, explaining how they differ from automatically exposed tools.

The Agents SDK provides resource methods. The installed MCP client provides prompt methods. Both call a real fixture server. The application explicitly chooses whether retrieved content enters the model request.

## Run in Windows Terminal

Use Node.js 24 or later and install the shared dependencies.

```powershell
cd ".\apps"
npm ci
npm run lesson:88
```

Open http://127.0.0.1:3188. The app includes scenario controls, actual source, execution evidence, a knowledge check, instructor guidance and Recording view.

The Agents SDK exposes listResources and readResource. This app calls the pinned @modelcontextprotocol/client package explicitly for listPrompts and getPrompt. Resource contents and prompt templates enter the model request only under the selected application policy.

Classroom model decisions are scripted while SDK transitions, validation and local protocols execute. To use live inference, copy .env.example to .env in this app folder, configure OPENAI_API_KEY and an accessible OPENAI_MODEL, then restart. Model decisions can vary and live runs incur charges.

## Record the walkthrough

```powershell
cd ".\apps\prompt-088-prompts-and-resources"
npm run record
```

The recorder saves a WebM and final-frame PNG in recordings and closes its owned browser and server.

[Official OpenAI documentation](https://developers.openai.com/api/docs/guides/agents/integrations-observability).
