# Student setup guide

[Course home](../README.md) · [180-lesson curriculum](CURRICULUM.md)

## Install and run

Install Git and **Node.js 24 or later**, including npm. Open Windows Terminal with PowerShell:

```powershell
git clone https://github.com/luiscoco/Udemy-OpenAI-Agent-SDK.git
Set-Location .\Udemy-OpenAI-Agent-SDK\apps
npm ci
npm run lesson:5
```

Open http://127.0.0.1:3105. Keep the terminal running; press **Ctrl+C** to stop the server.

From `apps`, select another lesson with `npm run lesson:NUMBER`. Scripts cover 1–200; the core course covers **1–180**. The default port is **3100 + the prompt number**. Applications share the runtime, so keep the folder structure intact.

### Prompt 1 uses the same commands

From `apps`, run `npm run lesson:1` and open http://127.0.0.1:3101. All lesson folders use `server.mjs`, `src/application.mjs`, and `SOURCE.md`. After the shared install you may also run `npm start` from any prompt folder. Prompt 1 retains its own package file for an optional separate installation.

## Execution modes

| Feature | Requirements and scope |
| --- | --- |
| Classroom mode | Local examples and explicitly labeled fixtures; many labs need no API key. |
| Actual local SDK execution | Real SDK operations, sometimes with scripted model responses. Inspect the execution evidence. |
| Live model calls | Your own credentials, compatible model access, and usage charges. Availability depends on the lesson. |
| Hosted tools and services | May require additional service configuration or account access. |
| Python exercises | Additional Python setup below. |
| Optional Docker sandbox provider | Docker with Linux containers; Docker is not required for every lab. |

A SQL tutor identity does not itself host a SQL database. Read the selected application's code and evidence to distinguish a database operation, a local fixture, and an external service.

## Optional live configuration

The shared launcher reads the **selected prompt folder's `.env`**. For example, from `apps`:

```powershell
Copy-Item .\prompt-057-first-function-tool\.env.example .\prompt-057-first-function-tool\.env
notepad .\prompt-057-first-function-tool\.env
```

If `.env` already exists, edit it instead of overwriting it. Set your own `OPENAI_API_KEY` and a compatible `OPENAI_MODEL` available to your project. Restart the application after saving, then select its live mode if supported. Prompt 1 reads its own `.env` through its start command. Other services have configuration in their application README and example files.

Do not share credentials in issues, screenshots, or commits. Blank `.env.example` templates are included; private environment files are ignored.

## Python exercises

The workspace-local Windows x64 setup requires **PowerShell 7 (`pwsh`)** and internet access for the interpreter and pinned dependencies. From `apps`:

```powershell
npm run setup:python
npm run lesson:25
```

Open http://127.0.0.1:3125. The interpreter is installed under `apps/.runtime`, outside Git. Prompt 41 also exercises Python execution methods.

For an existing Python environment, install `apps/foundations-runtime/requirements-python.txt` there and set `CLASSROOM_PYTHON` to that environment's interpreter path in the selected lesson's `.env`.

## Read and change the actual source

Each prompt folder contains `src/application.mjs`, its practical implementation, and a `SOURCE.md` guide. Both launch methods use this local code. Edit a file under the selected prompt’s `src`, restart the server, and rerun the scenario. The source explorer reads the same local files. Shared HTML, CSS, browser infrastructure, and common helpers remain in `apps/foundations-runtime`; keep the whole repository together. See the [source index](SOURCE_CODE.md).

## Learning workflow

1. Read the implementation prompt and predict the first scenario's result.
2. Run it and inspect the execution scope, stages, output, and evidence.
3. Find the corresponding source in the explorer.
4. Change one input and compare the next scenario.
5. Answer the knowledge check and explain the result in your own words.

## Troubleshooting

| Problem | Action |
| --- | --- |
| `node` or `npm` is not recognized | Install Node.js and reopen the terminal. |
| PowerShell blocks `npm.ps1` | Use `npm.cmd ci` and `npm.cmd run lesson:5`; no execution-policy change is necessary. |
| Page does not load | Keep the server running and use its printed URL. |
| Module is missing | Run `npm ci` from `apps`; keep the complete repository structure together. |
| Port is busy | Stop the previous server or use an alternate port below. |
| Python is missing | Follow the Python setup and the selected lesson's README. |
| Live request fails | Check the selected `.env`, model access, and service configuration; restart after editing. |

Use an alternate port in the current PowerShell session:

```powershell
$env:PORT = '4105'
npm run lesson:5
```

Open http://127.0.0.1:4105. After stopping the server, clear the override with `Remove-Item Env:PORT`.

## Updates and checks

From the repository root:

```powershell
git pull --ff-only
Set-Location .\apps
npm ci
node --test foundations-runtime/tests/syntax.test.mjs foundations-runtime/tests/identity.test.mjs foundations-runtime/tests/definitions.test.mjs
```

Focused tests live in `apps/foundations-runtime/tests`. `npm run test:course` exercises the broader local course scenarios and subprocesses and may take longer.

This is a **source-only student checkout**. Videos, narration, generated archives, local databases, installed dependencies, and instructor rendering assets are not included. Instructor export and video npm scripts require their separate production artifacts; students should use the lesson launchers.

## Help

[Open an issue](https://github.com/luiscoco/Udemy-OpenAI-Agent-SDK/issues) with the prompt number, scenario, operating system, Node.js version, command, and relevant error—without credentials or private data. Use the Udemy Q&A for lecture questions.
