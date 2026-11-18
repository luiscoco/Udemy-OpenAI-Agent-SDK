// Executable entry point for Prompt 80: Computer use.
import {readFile} from 'node:fs/promises';
import {executeLesson as executeLocal} from './execute.mjs';
import {localApplication} from '../../foundations-runtime/local-applications.mjs';
import {createApp as sharedApp,startLesson} from '../../foundations-runtime/server.mjs';
const manifest=JSON.parse(await readFile(new URL('./source-map.json',import.meta.url),'utf8'));
export const lessonNumber=80;
export const createApp=(options={})=>sharedApp({number:lessonNumber,execute,sources,publicOverrides,...options});
export const startApplication=()=>startLesson(lessonNumber,{execute,sources,publicOverrides});
export const publicOverrides=Object.fromEntries(Object.entries(manifest.publicFiles).map(([name,path])=>[name,new URL('./'+path,import.meta.url)]));
export const execute=async(number,input,options)=>number===lessonNumber?executeLocal(number,input,options):(await localApplication(number)).execute(number,input,options);
export async function sources(number){if(number!==lessonNumber)return (await localApplication(number)).sources(number);return Object.fromEntries(await Promise.all(Object.entries(manifest.sources).map(async([name,path])=>[name,await readFile(new URL('./'+path,import.meta.url),'utf8')])));}
