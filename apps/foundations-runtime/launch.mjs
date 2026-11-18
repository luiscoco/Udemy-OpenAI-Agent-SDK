import { existsSync } from "node:fs";
import { getLesson } from "./catalog.mjs";

const number=Number(process.argv[2]??2);
const lesson=number===1?{number:1,folder:'prompt-001-product-map'}:getLesson(number);
const envFile = new URL(`../${lesson.folder}/.env`, import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);
// Load the selected application's entry point so edits to its src files are
// used by both `npm run lesson:N` and `npm start` in the prompt folder.
const {startApplication}=await import(new URL(`../${lesson.folder}/server.mjs`, import.meta.url));
startApplication();
