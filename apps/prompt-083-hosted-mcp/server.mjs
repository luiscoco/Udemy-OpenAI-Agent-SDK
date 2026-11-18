import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {startApplication} from './src/application.mjs';
export {createApp,startApplication} from './src/application.mjs';

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)startApplication();
