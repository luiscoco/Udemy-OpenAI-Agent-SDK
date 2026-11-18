import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {lessons} from '../catalog.mjs';
import {createApp} from '../server.mjs';
const apps=fileURLToPath(new URL('../../',import.meta.url));
test('Prompt 1 follows the same local entry-point and source-manifest layout',async()=>{
 const folder=resolve(apps,'prompt-001-product-map'),manifest=JSON.parse(await readFile(resolve(folder,'src/source-map.json'),'utf8'));
 assert.equal(manifest.number,1);assert.equal(manifest.implementation,'application.mjs');
 for(const file of Object.values(manifest.sources))assert.ok((await stat(resolve(folder,'src',file))).size>0);
 const local=await import(pathToFileURL(resolve(folder,'src/application.mjs')));assert.equal(typeof local.createApp,'function');assert.equal(typeof local.startApplication,'function');
 assert.match(await readFile(resolve(folder,'server.mjs'),'utf8'),/\.\/src\/application\.mjs/);
});
test('every shared lesson has actual local source, a source guide, and a wired server',async()=>{
 for(const lesson of lessons){
  const folder=resolve(apps,lesson.folder),src=resolve(folder,'src'),manifest=JSON.parse(await readFile(resolve(src,'source-map.json'),'utf8'));
  assert.equal(manifest.number,lesson.number);assert.ok(manifest.files.includes(manifest.implementation));
  assert.ok(Object.keys(manifest.sources).length);
  for(const file of [...manifest.files,...Object.values(manifest.sources)]){const target=resolve(src,file);assert.ok(target.startsWith(src+sep));assert.ok((await stat(target)).size>0);}
  assert.match(await readFile(resolve(folder,'server.mjs'),'utf8'),/\.\/src\/application\.mjs/);
  assert.match(await readFile(resolve(folder,'SOURCE.md'),'utf8'),/Practical implementation/);
 }
});
test('HTTP execution and source exploration use the prompt-local implementation',async()=>{
 const folder=resolve(apps,'prompt-009-agent-identity'),local=await import(pathToFileURL(resolve(folder,'src/application.mjs')));
 const server=createApp({number:9,env:{},execute:local.execute,sources:local.sources,publicOverrides:local.publicOverrides});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const response=await fetch(base+'/api/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'classroom',scenario:'relevant'})});assert.equal(response.status,200);const result=await response.json();assert.match(result.output,/GROUP BY/);
  const source=await(await fetch(base+'/api/source?name=identity%2Fspecialist-agent.mjs')).text();assert.equal(source,await readFile(resolve(folder,'src/examples/identity/specialist-agent.mjs'),'utf8'));
  const browserContract=await(await fetch(base+'/identity.js')).text();assert.equal(browserContract,await readFile(resolve(folder,'src/public/identity.js'),'utf8'));
  assert.equal((await fetch(base+'/api/source?name=../../.env')).status,404);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
