
function toDueLabel(dueString: string) {
    return dueString
        ?.replaceAll(" ", "-")
        ?.replace("every-1-", "every-")
        ?.replace("day", "day🌞")
        ?.replace("month", "month🌒") 
}
    
export function processTask(task: any) {

    // Remove all labels that start with "every-", "🔹", "🎆" or are due dates
    let labels = task.labels.filter((label: string) => 
           !label.startsWith("every-") 
        && !label.startsWith("🔹") 
        && !label.startsWith("🎆")
    //    && !/^\d{4}-\d{2}-\d{2}/.test(label)
        && label !== toDueLabel(task.due?.string)
    );
  
    if (!task.due?.is_recurring) 
        labels.push("🎆"); //("🔹"); 
    
    let dueLabel = task.due?.string
      ?.replaceAll(" ", "-")
      ?.replace("every-1-", "every-")
      ?.replace("day", "day🌞")
      ?.replace("month", "month🌒") 
    
    if (dueLabel)
      labels.push(dueLabel);
  
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
        content?: string; 
        labels?: string[] 
    } = {};

    if (task.content !== content)
        result.content = content;

    if (task.labels.sort().join() !== labels.sort().join()) // TODO
        result.labels = labels;

    return result;
}