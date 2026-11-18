import {getLesson} from './catalog.mjs';

// Load application logic without starting another HTTP server. This keeps the
// lesson navigation on an existing server connected to each prompt's local code.
export async function localApplication(number){
 const lesson=getLesson(number);
 return import(new URL(`../${lesson.folder}/src/application.mjs`,import.meta.url));
}
