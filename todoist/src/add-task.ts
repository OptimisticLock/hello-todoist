import 'dotenv/config';
import axios from "axios";
import { argv } from 'process';
const apiToken = process.env.TOKEN;

async function addTask(data: any) {
  const url = 'https://api.todoist.com/rest/v2/tasks';
  const config = {headers: {Authorization: `Bearer ${apiToken}`}};
  const response = await axios.post(url, data, config);
  return response;
}

async function main() {
  try {
    const commandLineArgs = argv.slice(2);
    const content = commandLineArgs.join(' ');
    const response = await addTask({content});
    console.log ("TASK ADDED: ", response);
  }
  catch (error) {
    console.error(error);
  }
}

main();

