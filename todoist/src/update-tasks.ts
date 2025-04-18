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
    //const url = 'https://api.todoist.com/rest/v2/tasks';
    const url = 'https://todoist.com/api/v1/tasks?limit=30';
    console.log("Fetching Tasks from todoist.com");
    const response = await axios.get(url, { headers: {Authorization: `Bearer ${apiToken}`} });
    console.log("Got tasks from todoist.com");
    await processTasks(response.data);
    console.log("Processed response from todoist");
    console.log("Done");

  } catch (error) {
    console.error('###### Error!!! ######');
    console.error('Error fetching tasks:', error);
  }
};

const updateTask = async (id: string, data: any) => {
  const url = 'https://api.todoist.com/rest/v2/tasks/' + id;
  const config = {headers: {Authorization: `Bearer ${apiToken}`} };
  const response = await axios.post(url, data, config);
  return response;
}


async function processTasks(tasks: any) {
  let count = 0;

  for (const task of tasks) {
    console.log(`Task: ${count++}: ${task.content}`);
    const id = task.id;
    const dueString = task?.due?.string;
    const dueLabel = task?.due?.string?.replaceAll(" ", "-"); // ?.replace("every", "every-");
   // const was = {...task};
    const labels = [... task.labels, "api_v1"];

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
  await fs.writeFile('ignoreMe/todoist-tasks.json', jsonString);
  console.log('Tasks have been saved to ignoreMe/todoist-tasks.json');

}

fetchTasks();
