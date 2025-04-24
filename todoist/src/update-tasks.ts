// import {json} from "node:stream/consumers";
import 'dotenv/config';
import axios from 'axios';

import { promises as fs } from 'fs';
import { Task } from './Task.js';

console.log("Hello!");
console.time("Total Execution Time");

const apiToken = process.env.TOKEN;
let totalCount = 0;

const fetchTasks = async (url: string) => {

  let syncToken;
  try {
    let count = 0;
    console.log("Fetching Tasks from ", url);
    while (true) {
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${apiToken}` } });
      let tasks = response.data.results || response.data.items;
      syncToken = response.data.sync_token;
      totalCount += tasks.length;
      console.log(`Got ${tasks.length} tasks from todoist.com. Total: ${totalCount}`);

      // TODO: this assumes that all tasks were fetched and disregards the cursor logic. Which is in line with the new sync api.
      Task.initialize(tasks); 

      for (const t of tasks) {
        const task = Object.assign(new Task(), t);
        const taskChanges = task.groom();
        if (Object.keys(taskChanges).length > 0) {
          console.log("~~~~~~~Task modified:", task.content, taskChanges);
          //            taskChanges.aaa = "bbb"; // FIXME
          console.log("~~~~~~~Was:          ", { content: task.content, labels: task.labels });

          const result = await updateTask(task.id, taskChanges);

        }
      }
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

    return syncToken;

  } catch (error) {
    console.error('###### Error!!! ######', error);
    throw error;
  }
};




//   const jsonString = JSON.stringify(tasks, null, 4);
//  // console.log('Tasks:', response.data);
//   // console.log("String: ", jsonString);
//   await fs.writeFile('ignoreMe/todoist-tasks.json', jsonString);
//   console.log('Tasks have been saved to ignoreMe/todoist-tasks.json');

const updateTask = async (id: string, data: any) => {
  const url = 'https://api.todoist.com/rest/v2/tasks/' + id;  // TODO update to the new API
  //const url = 'https://todoist.com/api/v1/tasks/' + id;  
  const config = { headers: { Authorization: `Bearer ${apiToken}` } };
  const response = await axios.post(url, data, config);
  return response;
}

// const activeURL = 'https://todoist.com/api/v1/tasks';
// console.log("############################################ Fetching active tasks");
// await fetchTasks(activeURL);

// const activeUrl = 'https://api.todoist.com/api/v1/sync?sync_token=*&resource_types=["all"]';
// console.log("############################################ Fetching active tasks via sync api");
// await fetchTasks(activeUrl);


const completedURL = 'https://api.todoist.com/sync/v9/sync?resource_types=["items"]&sync_token=*';
console.log("############################################### Fetching completed tasks");
const syncToken = await fetchTasks(completedURL);
console.log("Done. Sync token: ", syncToken);
console.timeEnd("Total Execution Time");


