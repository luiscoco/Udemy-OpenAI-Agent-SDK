import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,relative,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {lessons} from '../catalog.mjs';
import {sourcePaths,lessonSources} from '../execute.mjs';
import {courseModule} from '../course/index.mjs';

const runtime=fileURLToPath(new URL('../',import.meta.url)),apps=resolve(runtime,'..');
const exists=p=>access(p).then(()=>true,()=>false);
const posix=p=>p.split(sep).join('/');
const rel=(from,to)=>{let p=posix(relative(dirname(from),to));return p.startsWith('.')?p:'./'+p;};
const requested=process.argv.slice(2).map(Number).filter(Number.isInteger);
function handler(n){return n<9?'execute.mjs':n===9?'identity-lesson.mjs':n<=16?'definition-lessons.mjs':n<=24?'context-execution.mjs':n<=34?'structured-execution.mjs':n<=44?'runtime-execution.mjs':n<=54?'streaming-execution.mjs':n<=64?'tools-execution.mjs':n<=70?'control-execution.mjs':n<=74?'discovery-execution.mjs':n<=80?'hosted-execution.mjs':n<=84?'mcp-execution.mjs':n<=88?'mcp-control-execution.mjs':n<=94?'handoff-execution.mjs':n===166?'course/gpt-live.mjs':`course/${courseModule(n)}.mjs`;}

for(const lesson of lessons.filter(l=>!requested.length||requested.includes(l.number))){
 const n=lesson.number,folder=resolve(apps,lesson.folder),src=resolve(folder,'src'),shown=await lessonSources(n),mapping=new Map(),display={};
 const add=p=>{const original=resolve(runtime,p);if(!original.startsWith(runtime))throw Error('Source outside shared runtime');mapping.set(original,resolve(src,relative(runtime,original)));return original;};
 add('execute.mjs');add(handler(n));if(n<=8)add('bootstrap.mjs');if(n>=95)add('course/index.mjs');
 if(Object.keys(shown).some(name=>name.endsWith('.py')))add('python-runtime.mjs');
 for(const name of Object.keys(shown)){const path=sourcePaths[name]??'./'+name;const original=add(path);display[name]=posix(relative(src,mapping.get(original)));}
 const implementation=posix(relative(src,mapping.get(resolve(runtime,handler(n)))));
 if(!Object.values(display).includes(implementation))display['implementation/'+implementation]=implementation;
 display['application.mjs']='application.mjs';
 // Keep domain data and its browser dependencies local too. Framework utilities
 // and unrelated lesson modules remain explicit shared imports.
 for(const original of [...mapping.keys()]){
  const text=await readFile(original,'utf8');
  for(const m of text.matchAll(/(?:from\s*|import\s*\()\s*["'](\.\.?\/[^"']+)["']/g)){
   const dependency=resolve(dirname(original),m[1]);
   if(dependency.startsWith(resolve(runtime,'public')+sep)&&/\.js$/.test(dependency))add(relative(runtime,dependency));
  }
 }
 // Public domain modules are imported in both Node and the browser; retain
 // their relative URLs by including the complete relative dependency closure.
 let previous=-1;while(previous!==mapping.size){previous=mapping.size;for(const original of [...mapping.keys()].filter(p=>p.startsWith(resolve(runtime,'public')+sep))){const text=await readFile(original,'utf8');for(const m of text.matchAll(/(?:from\s*|import\s*\()\s*["'](\.\.?\/[^"']+)["']/g)){const dependency=resolve(dirname(original),m[1]);if(await exists(dependency))add(relative(runtime,dependency));}}}
 for(const [original,target]of mapping){
  let text=await readFile(original,'utf8');
  if(original===resolve(runtime,'execute.mjs')){
   const start=text.indexOf('export const sourcePaths ='),end=text.indexOf('export const capabilities =');
   if(start<0||end<start)throw Error('Cannot locate execution/source boundary');
   text=text.slice(0,start)+text.slice(end);
  }
  if(!original.startsWith(resolve(runtime,'public')+sep)){
   const replacements=[];
   for(const m of text.matchAll(/(["'])(\.\.?\/[^"'\r\n]+)\1/g)){
    const before=text.slice(Math.max(0,m.index-120),m.index);
    if(!/(?:\bfrom|\bimport|\bimport\s*\(|\brequire\s*\(|\bread\s*\(|\bnew\s+URL\s*\()\s*$/.test(before))continue;
    const value=m[2];if(value.includes('\\')||value.includes('${'))continue;
    const absolute=resolve(dirname(original),value);
    const destination=mapping.get(absolute)??absolute;
    const valueNew=rel(target,destination)+(value.endsWith('/')?'/':'');
    replacements.push({start:m.index+m[1].length,end:m.index+m[1].length+value.length,value:valueNew});
   }
   for(const r of replacements.reverse())text=text.slice(0,r.start)+r.value+text.slice(r.end);
  }
  await mkdir(dirname(target),{recursive:true});await writeFile(target,text);
 }
 const publicFiles=Object.fromEntries([...mapping.values()].filter(p=>p.startsWith(resolve(src,'public')+sep)).map(p=>[posix(relative(resolve(src,'public'),p)),posix(relative(src,p))]));
 const manifest={number:n,title:lesson.title,implementation,sources:display,publicFiles,sharedRuntime:'../../foundations-runtime',files:[...mapping.values()].map(p=>posix(relative(src,p)))};
 await writeFile(resolve(src,'source-map.json'),JSON.stringify(manifest,null,2)+'\n');
 await writeFile(resolve(src,'application.mjs'),`// Executable entry point for Prompt ${n}: ${lesson.title}.\nimport {readFile} from 'node:fs/promises';\nimport {executeLesson as executeLocal} from './execute.mjs';\nimport {localApplication} from '../../foundations-runtime/local-applications.mjs';\nimport {createApp as sharedApp,startLesson} from '../../foundations-runtime/server.mjs';\nconst manifest=JSON.parse(await readFile(new URL('./source-map.json',import.meta.url),'utf8'));\nexport const lessonNumber=${n};\nexport const createApp=(options={})=>sharedApp({number:lessonNumber,execute,sources,publicOverrides,...options});\nexport const startApplication=()=>startLesson(lessonNumber,{execute,sources,publicOverrides});\nexport const publicOverrides=Object.fromEntries(Object.entries(manifest.publicFiles).map(([name,path])=>[name,new URL('./'+path,import.meta.url)]));\nexport const execute=async(number,input,options)=>number===lessonNumber?executeLocal(number,input,options):(await localApplication(number)).execute(number,input,options);\nexport async function sources(number){if(number!==lessonNumber)return (await localApplication(number)).sources(number);return Object.fromEntries(await Promise.all(Object.entries(manifest.sources).map(async([name,path])=>[name,await readFile(new URL('./'+path,import.meta.url),'utf8')])));}\n`);
 await writeFile(resolve(folder,'server.mjs'),`import {resolve} from 'node:path';\nimport {pathToFileURL} from 'node:url';\nimport {startApplication} from './src/application.mjs';\nexport {createApp,startApplication} from './src/application.mjs';\n\nif(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)startApplication();\n`);
 let doc=`# Practical application source — Prompt ${n}: ${lesson.title}\n\nThis folder contains the lesson's executable implementation, not just a launcher.\n\n## Start here\n\n- [Application entry point](src/application.mjs) — binds this prompt's local implementation to the shared HTTP/UI framework.\n- [Practical implementation](src/${manifest.implementation}) — the code that implements the demonstrated behavior.\n- [Execution flow](src/execute.mjs) — dispatches this lesson's classroom/live path.\n- [Server entry point](server.mjs).\n\n## Source shown in the application\n\n`;
 for(const [name,path]of Object.entries(display))doc+=`- [${name}](src/${path})\n`;
 doc+='\n## Run and edit\n\nFrom the repository root, install the shared dependencies once:\n\n```powershell\nSet-Location .\\apps\nnpm ci\nnpm run lesson:'+n+'\n```\n\nOpen http://127.0.0.1:'+lesson.port+'. You can also run `npm start` from this prompt folder after installing the shared dependencies.\n\nEdit the implementation files under `src`, restart the server, and rerun the exercise. The in-app source explorer reads these local files. Shared UI, SDK plumbing, and common utilities remain in [foundations-runtime](../foundations-runtime/); retain that folder and the shared `apps/node_modules`. This is not an isolated folder-only distribution. Some implementation modules expose several related scenarios; the application binds prompt '+n+'.\n\n`src/source-map.json` records the exact local paths. These are executable working copies: changes are not overwritten unless an instructor explicitly reruns the materialization script.\n';
 await writeFile(resolve(folder,'SOURCE.md'),doc);
 let readme=await readFile(resolve(folder,'README.md'),'utf8');if(!readme.includes('## Practical application source')){const newline=readme.indexOf('\n');readme=readme.slice(0,newline+1)+'\n## Practical application source\n\n**[Open the executable implementation and source map](SOURCE.md)** · [Application entry point](src/application.mjs) · [Implementation](src/'+manifest.implementation+')\n\nThe lesson now runs the local source in this folder; the common UI and utilities are shared.\n'+readme.slice(newline+1);await writeFile(resolve(folder,'README.md'),readme);}
 console.log(`LOCAL SOURCE ${n}: ${mapping.size} implementation files`);
}
