

export function processTask(task: any) {

    let labels = task.labels.filter((label: string) => !label.startsWith("every-") && !label.startsWith("🔹") && !label.startsWith("🎆"));
  
    if (!task?.due?.is_recurring) 
        labels.push("🎆"); //("🔹"); 
    
    const dueLabel = task?.due?.string
      ?.replaceAll(" ", "-")
      ?.replace("every-1-", "every-")
      ?.replace("day", "day🌞")
      ?.replace("month", "month🌒") 

    if (dueLabel)
      labels.push(dueLabel);
  
    const content = task.content;

    if (task.content.startsWith("CCCDDD")) 
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ", task.content);
    
    if (task.parent_id === null && task.content.startsWith("⤷ ")) { // TODO: regex for white space
      console.log("Task is not a subtask, removing ⤷ from content: ", task.content);
      task.content = task.content.substring(2);
    }  
    else if (task.parent_id !== null && !task.content.startsWith("⤷ ")) {
      console.log("Task is a subtask, adding ⤷ to content: ", task.content);
      task.content = "⤷ " + task.content;
    }
  
    //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Task modified:", task.content); //, "now: ", result);
  
    return {labels, content} // TODO check if labels and content are different
  }