export class Task {
    private static all: { [key: string]: any } = {};
    private static queue: any[] = [];

    labels: string[] = [];
    due: {[key: string]: any} = {};
    parent_id?: string;
    indent: number = 0;
    content: string = "";

    private toDueLabel(dueString: string) {
        return dueString
            ?.replaceAll(" ", "-")
            ?.replace("every-1-", "every-")
            ?.replace(/every-day.*/, "every-day🌞")
            ?.replace(/every-month.*/, "every-month🌗")
    }

    public groom() {

        // Remove all labels that start with "every-", "🔹", "🎆" or are due dates
        let labels = this.labels.filter((label: string) =>
            !label.startsWith("every-")
            && !label.startsWith("🔹")
            && !label.startsWith("🎆")
            && !label.startsWith("➡")
            //    && !/^\d{4}-\d{2}-\d{2}/.test(label)
            && label !== this.toDueLabel(this.due?.string)
        );

        if (this.parent_id) {
            if (!(this.parent_id in Task.all))
                Task.queue.push(this); // FIXME static

            this.indent = Task.all[this.parent_id]?.indent + 1 || 1;
            const indentLabel = "➡".repeat(this.indent);
            labels.push(indentLabel);
        }

        if (this.labels.includes("debug")) { // FIXME
            console.log("Debug label found in task labels."); // indent 1
            //      task.labels.push("debug" + new Date());
        }

        if (!this.due?.is_recurring)
       //     labels.push("🎆"); //("🔹"); 
            labels.push("🎇"); //("🔹"); 

        if (this.due?.is_recurring && this.due?.string) {
            const dueLabel = this. toDueLabel(this.due?.string);
            labels.push(dueLabel);
        }

        let content = this.content;

        if (this.content.startsWith("CCCDDD"))
            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ", this.content); // FIXME

        if (this.parent_id === null && this.content.startsWith("⤷ ")) { // TODO: regex for white space
            console.log("Task is not a subtask, removing ⤷ from content: ", this.content);
            content = this.content.substring(2);
        }
        else if (this.parent_id !== null && !this.content.startsWith("⤷ ")) {
            console.log("Task is a subtask, adding ⤷ to content: ", this.content);
            content = "⤷ " + this.content;
        }

        const result: {
            aaa?: string;
            content?: string;
            labels?: string[]
        } = {};

        if (this.content !== content)
            result.content = content;

        if (this.labels.sort().join() !== labels.sort().join()) // TODO
            result.labels = labels;

        return result;
    }
}