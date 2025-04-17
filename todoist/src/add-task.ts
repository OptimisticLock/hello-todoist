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
    const content = "ABCABC " + commandLineArgs.join(' ') + " " + new Date().toISOString();
    const response = await addTask({content, labels: ["cli"]});
    console.log ("TASK ADDED: ", response);
  }
  catch (error) {
    console.error(error);
  }
}

main();

