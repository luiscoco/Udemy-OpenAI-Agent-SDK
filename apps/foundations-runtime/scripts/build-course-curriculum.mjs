import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {lessons} from '../catalog.mjs';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const sections=['Getting Started with the OpenAI Agents SDK','Agent Identity and Instruction Design','Context, Dependencies, and Authorization','Structured Outputs and Multimodal Inputs','Models, Settings, and API Integration','Execution, Results, and Usage','Streaming and Interactive Applications','Building Function Tools','Controlling Tool Execution','Search, Retrieval, and Hosted Tools','Model Context Protocol — MCP','Handoffs and Specialist Ownership','Multi-Agent Orchestration Patterns','Sessions, Conversation History, and Memory','Guardrails and Validation','Human Approval and Resumable Execution','Sandbox Agents and Workspaces','Sandbox Capabilities, Skills, and Memory','Tracing, Hooks, and Observability','Realtime Speech-to-Speech Agents','Voice Pipelines and Integrations','Testing and Evaluation','Reliability and Background Execution'];
const core=[{number:1,title:'OpenAI product map',folder:'prompt-001-product-map',summary:'Compare the developer products and locate the agent orchestration boundary.'},...lessons.filter(l=>l.number<=180)].sort((a,b)=>a.number-b.number);
if(core.length!==180||core.some((l,i)=>l.number!==i+1))throw Error('Expected core lessons 1–180 exactly once.');
let md='# Course curriculum\n\n[Course home](../README.md) · [Student setup guide](GETTING_STARTED.md)\n\n**23 sections · 180 core lessons · Prompt numbers match the applications and course videos.**\n\nRun Prompts 1–180 from `apps` with `npm run lesson:NUMBER`. Their default port is `3100 + NUMBER`. All prompts use the same launcher and src/application.mjs folder layout.\n\nEach lesson combines an implementation prompt, a runnable application, a code walkthrough, execution evidence, and a knowledge check.\n\n';
for(const [i,section]of sections.entries()){
 md+=`## Section ${i+1}: ${section}\n\n| Prompt | Lesson and application | Practical source | Practice focus |\n| --- | --- | --- | --- |\n`;
 for(const l of core.filter(l=>l.number>=i*8+1&&l.number<=Math.min(180,(i+1)*8))){const source=l.number===1?'src/adapters/agents-sdk.mjs':'src/'+JSON.parse(await readFile(resolve(root,'apps',l.folder,'src/source-map.json'),'utf8')).implementation;md+=`| ${l.number} | [${l.title}](../apps/${l.folder}/) | [Implementation](../apps/${l.folder}/${source}) | ${String(l.summary??l.headline??l.title).replaceAll('|',' / ').replace(/\s+/g,' ')} |\n`;}
 md+='\n';
}
md+='## Supplementary applications\n\nApplications 181–200 are included for independent exploration, outside the 180-lesson core course and its video numbering. Run them with `npm run lesson:181` through `npm run lesson:200`.\n';
await mkdir(resolve(root,'docs/assets'),{recursive:true});await writeFile(resolve(root,'docs/CURRICULUM.md'),md);
console.log(JSON.stringify({sections:sections.length,coreLessons:core.length}));
