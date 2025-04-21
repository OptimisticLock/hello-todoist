// import {json} from "node:stream/consumers";
import 'dotenv/config';
import axios from 'axios';
const fs = require('fs').promises;

console.log("Hello!");
console.time("Total Execution Time");

const apiToken = process.env.TOKEN;
let totalCount = 0;

const fetchTasks = async () => {
  try {
    console.log("Fetching Tasks from todoist.com");
    let url = 'https://todoist.com/api/v1/tasks';
    while (true) {
      const response = await axios.get(url, { headers: {Authorization: `Bearer ${apiToken}`} });
      const count = response.data.results.length;
      totalCount += count;
      console.log(`Got ${count} tasks from todoist.com. Total: ${totalCount}`);
      await processTasks(response.data.results);
      console.log("Processed response from todoist");
      let cursor = response.data.next_cursor;
      if (!cursor) {
        console.log("No more tasks to process");
        break;
      }
      url = 'https://todoist.com/api/v1/tasks?cursor=' + cursor;
      console.log("Next cursor: ", cursor);
      console.log("Next URL: ", url);
      console.log("Fetching next page of tasks");
    }

 //   const updateTaskResult = await updateTask('4629630727', {"content": "Buy Coffee " + new Date(), labels: ["api123"]});
 //   console.log("Task updated: " + updateTaskResult);
    //const url = 'https://api.todoist.com/rest/v2/tasks';

    console.log("Done");
    console.timeEnd("Total Execution Time");

  } catch (error) {
    console.error('###### Error!!! ######');
    console.error('Error fetching tasks:', error);
    console.timeEnd("Total Execution Time");
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
//    console.log("####### Task: ", task);
    console.log(`Task: ${count++}: ${task.content}`);
    const id = task.id;
    const dueString = task?.due?.string;
    const dueLabel = task?.due?.string?.replaceAll(" ", "-").replace("every-1-", "every-"); // ?.replace("every", "every-");
   // const was = {...task};
    const labels = [... task.labels, "api_v1_take2"];
 //   const newLabels = labels;
    const newLabels = labels.filter(label => !label.startsWith("every-"));

    if (dueLabel)
      newLabels.push(dueLabel);
    else
      console.log("no due label for task: ", task.content);


  //  if (labels.length !== newLabels.length) {
      const result = await updateTask(task.id, {labels: newLabels});
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Task modified:", task.content); //, "now: ", result);
 //   }
  }

//   const jsonString = JSON.stringify(tasks, null, 4);
//  // console.log('Tasks:', response.data);
//   // console.log("String: ", jsonString);
//   await fs.writeFile('ignoreMe/todoist-tasks.json', jsonString);
//   console.log('Tasks have been saved to ignoreMe/todoist-tasks.json');

}

fetchTasks();
