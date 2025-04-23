const tasks: { [key: string]: any } = {};
const queue = [];


function toDueLabel(dueString: string) {
    return dueString
        ?.replaceAll(" ", "-")
        ?.replace("every-1-", "every-")
        ?.replace(/every-day.*/, "every-day🌞")
        ?.replace(/every-month.*/, "every-month🌗") 
}




    
export function processTask(task: any) {

    // Remove all labels that start with "every-", "🔹", "🎆" or are due dates
    let labels = task.labels.filter((label: string) => 
           !label.startsWith("every-") 
        && !label.startsWith("🔹") 
        && !label.startsWith("🎆")
        && !label.startsWith("➡")
    //    && !/^\d{4}-\d{2}-\d{2}/.test(label)
        && label !== toDueLabel(task.due?.string)
    );

    if (task.parent_id) {
        if (!(task.parent_id in tasks)) 
          queue.push(task);
        
        

        task.indent = tasks[task.parent_id]?.indent + 1 || 1; 
        const indentLabel = "➡".repeat(task.indent);
        labels.push(indentLabel);
    }

    if (task.labels.includes("debug")) { // FIXME
        console.log("Debug label found in task labels."); // indent 1
  //      task.labels.push("debug" + new Date());
    }

    if (!task.due?.is_recurring) 
        labels.push("🎆"); //("🔹"); 
    
    if (task.due?.is_recurring && task.due?.string) {
        const dueLabel = toDueLabel(task.due?.string);
        labels.push(dueLabel);
    }

    let content = task.content;

    if (task.content.startsWith("CCCDDD")) 
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ", task.content); // FIXME
    
    if (task.parent_id === null && task.content.startsWith("⤷ ")) { // TODO: regex for white space
      console.log("Task is not a subtask, removing ⤷ from content: ", task.content);
      content = task.content.substring(2);
    }  
    else if (task.parent_id !== null && !task.content.startsWith("⤷ ")) {
      console.log("Task is a subtask, adding ⤷ to content: ", task.content);
      content = "⤷ " + task.content;
    }
  
    const result: {
        aaa?: string;
        content?: string; 
        labels?: string[] 
    } = {};

    if (task.content !== content)
        result.content = content;

    if (task.labels.sort().join() !== labels.sort().join()) // TODO
        result.labels = labels;

    return result;
}