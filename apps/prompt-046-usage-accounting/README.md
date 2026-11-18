# Prompt 46 — Usage accounting

Collect available request counts and token usage for a run and its nested work.

Run in Windows Terminal with PowerShell.

```powershell
cd ".\apps"
npm ci
npm run lesson:46
```

Open http://127.0.0.1:3146.

These nested runs own separate usage contexts. Deduplicate response IDs and aggregate each response once.

The lesson executes the actual installed Agents SDK using a scripted local Model adapter. Token reports are synthetic teaching fixtures. Classroom examples require no API credentials. The source explorer, outcome evidence, knowledge check and instructor guide are included.

The parent and nested runs own separate RunContext usage. The application combines their disjoint response reports once and shows both per-run SDK totals. The fixture values demonstrate accounting and do not represent provider billing.

Record this lesson from its folder.

```powershell
cd ".\apps\prompt-046-usage-accounting"
npm run record
```

The recorder writes a WebM and final-frame PNG under recordings and closes its temporary browser and server.

[Official running-agent guidance](https://developers.openai.com/api/docs/guides/agents/running-agents) and [results guidance](https://developers.openai.com/api/docs/guides/agents/results).
