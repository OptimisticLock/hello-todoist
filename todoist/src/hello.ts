// import {json} from "node:stream/consumers";
import 'dotenv/config';
import axios from 'axios';
const fs = require('fs').promises;

console.log("Hello!");
const apiToken = process.env.TOKEN;

const fetchTasks = async () => {
  try {

 //   const updateTaskResult = await updateTask('4629630727', {"content": "Buy Coffee " + new Date(), labels: ["api123"]});
 //   console.log("Task updated: " + updateTaskResult);
    const url = 'https://api.todoist.com/rest/v2/tasks';
    console.log("Fetching Tasks from todoist.com");
    const response = await axios.get(url, { headers: {Authorization: `Bearer ${apiToken}`} });
    console.log("Got tasks from todoist.com");
    await processTasks(response.data);
    console.log("Processed response from todoist");
    console.log("Done");

  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const updateTask = async (id: string, data: any) => {
 // id = '4629630727';
  const url = 'https://api.todoist.com/rest/v2/tasks/' + id;
  const config = {headers: {Authorization: `Bearer ${apiToken}`} };
  const response = await axios.post(url, data, config);
  return response;
}


async function processTasks(tasks: any) {

  for (const task of tasks) {
    console.log("Task: ", task);
    const id = task.id;
    const dueString = task?.due?.string;
    const dueLabel = task?.due?.string?.replaceAll(" ", "-")?.replace("every", "ev-");
   // const was = {...task};
    const labels = [... task.labels, "api123"];

    if (dueLabel)
      labels.push(dueLabel);
    else
      console.log("wtf");

    const result = await updateTask(task.id, {labels});
    console.log("was: ", task, "now: ", result);
  }

  const jsonString = JSON.stringify(tasks, null, 4);
 // console.log('Tasks:', response.data);
  // console.log("String: ", jsonString);
  await fs.writeFile('todoist-tasks.json', jsonString);
  console.log('Tasks have been saved to todoist-tasks.json');

}

fetchTasks();
