import { existsSync } from "node:fs";
import { getLesson } from "./catalog.mjs";
import { startLesson } from "./server.mjs";

const lesson = getLesson(process.argv[2] ?? 2);
const envFile = new URL(`../${lesson.folder}/.env`, import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);
startLesson(lesson.number);
