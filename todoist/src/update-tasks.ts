// import {json} from "node:stream/consumers";
import 'dotenv/config';
import axios from 'axios';
import { processTask } from './process-task';
const fs = require('fs').promises;

console.log("Hello!");
console.time("Total Execution Time");

const apiToken = process.env.TOKEN;
let totalCount = 0;

const fetchTasks = async () => {
  try {
    let count = 0;
    console.log("Fetching Tasks from todoist.com");
    let url = 'https://todoist.com/api/v1/tasks';
    while (true) {
      const response = await axios.get(url, { headers: {Authorization: `Bearer ${apiToken}`} });
      const resultsLength = response.data.results.length;
      totalCount += resultsLength;
      console.log(`Got ${resultsLength} tasks from todoist.com. Total: ${totalCount}`);
     
      const tasks = response.data.results;

      for (const task of tasks) {
            const taskChanges = processTask(task);
            if (Object.keys(taskChanges).length > 0) {
              console.log("~~~~~~~Task modified:", task.content, taskChanges);
              const taskChanges2 = processTask(task); //fixme
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

    console.log("Done");
    console.timeEnd("Total Execution Time");

  } catch (error) {
    console.error('###### Error!!! ######');
    console.error('Error fetching tasks:', error);
    console.timeEnd("Total Execution Time");
  }
};




//   const jsonString = JSON.stringify(tasks, null, 4);
//  // console.log('Tasks:', response.data);
//   // console.log("String: ", jsonString);
//   await fs.writeFile('ignoreMe/todoist-tasks.json', jsonString);
//   console.log('Tasks have been saved to ignoreMe/todoist-tasks.json');

const updateTask = async (id: string, data: any) => {
  //const url = 'https://api.todoist.com/rest/v2/tasks/' + id;  // TODO update to the new API
  const url = 'https://todoist.com/api/v1/tasks/' + id;  
  const config = {headers: {Authorization: `Bearer ${apiToken}`} };
  const response = await axios.post(url, data, config);
  return response;
}


fetchTasks();
