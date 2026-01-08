import {format} from "date-fns";

class ToDo {
    #title;
    #description;
    #dueDate;
    #priority;
    #id;
    #checklist;

    constructor(title, description, priority, date = new Date(), id) {
        this.#title = title;
        this.#description = description;
        this.#priority = priority;
        this.#dueDate = date;
        this.#id = id;
        this.#checklist = new Set();
    }
    getId() {
        return this.#id;
    }
    getTitle() {
        return this.#title;
    }
    getDescription() {
        return this.#description;
    }
    getPriority() {
        return this.#priority;
    }
    getDate() {
        return this.#dueDate;
    }
    updateDate(date) {
        this.#dueDate = date;
    }
    updateTitle(title) {
        this.#title = title;
    }
    updatePriority(priority) {
        this.#priority = priority;
    }
    updateDescription(description) {
        this.#description = description;
    }
    addToChecklist(item) {
        this.#checklist.add(item);
    }
    removeFromChecklist(item) {
        this.#checklist.delete(item);
    }
    getChecklist() {
        return Array.from(this.#checklist);
    }

}

class Project {
    #toDoList;
    #name;
    #counter;
    #id;
    constructor(name, id) {
        this.#toDoList = new Array();
        this.#name = name;
        this.#id = id;
        this.#counter = 0;
    }

    getToDo(tid) {
        const toDoIndex = Finder.binSearch(this.#toDoList, tid)
        return (toDoIndex === -1) ? null : this.#toDoList[toDoIndex];
    }

    getChecklisk(tid) {
        const toDoIndex = Finder.binSearch(this.#toDoList, tid);
        return toDoIndex === -1 ? null : this.#toDoList[toDoIndex].getChecklist();
    }

    addToChecklist(tid, item) {
        const toDoIndex = Finder.binSearch(this.#toDoList, tid);
        if (toDoIndex !== -1) {
            this.#toDoList[toDoIndex].addToChecklist(item);
        }
    }

    removeFromChecklist(tid, item) {
        const toDoIndex = Finder.binSearch(this.#toDoList, tid);
        if (toDoIndex !== -1) {
            this.#toDoList[toDoIndex].removeFromChecklist(item);
        }
    }

    getToDos() {
        return this.#toDoList;
    }

    addToDo(title, description, priority, date) {
        let newToDo = new ToDo(title, description, priority, date, this.#counter++);
        this.#toDoList.push(newToDo)
        return newToDo;
    }
    removeToDo(tid) {
        const index = Finder.binSearch(this.#toDoList, tid)
        if (index !== -1) {
            this.#toDoList.splice(index, 1)
        }
    }

    getName() {
        return this.#name;
    }

    getId() {
        return this.#id;
    }

}

class ToDoManager {
    #projects;
    #counter;
    constructor() {
        this.#counter = 0
        this.#projects = new Array();
    }
    addProject(name) {
        const projectID = this.#counter++;
        const newProject = new Project(name, projectID);
        newProject.addToDo("Something", "For testing", 0);
        this.#projects.push(newProject);
        return newProject;
    }
    removeProject(id) {
        //#projects ID's are in strictly increasing order
        //use binary search
        const indexToRemove = Finder.binSearch(this.#projects, id);
        if (indexToRemove === -1) {
            return false
        } else {
            //delete the element
            //TODO: update this when localStorage introduced
            this.#projects.splice(indexToRemove, 1);
        }
    }
    getProjects() {
        return this.#projects;
    }
    addToDo(pid, title, description, priority, date) {
        const project = this.getProject(pid);
        if (project !== null) {
            return project.addToDo(title, description, priority, date);
        }
        return null
    }
    removeToDo(pid, tid) {
        const project = this.getProject(pid);
        if (project !== null) {
            return project.removeToDo(tid);
        }
    }
    getToDo(pid, tid) {
        const project = this.getProject(pid);
        return project === null ? null : project.getToDo(tid);
    }

    getProject(projectId) {
        const projectIndex = Finder.binSearch(this.#projects, projectId)
        return projectIndex === -1 ? null : this.#projects[projectIndex];
    }
    updateTitle(pid, tid, title) {
        const toDo = this.getToDo(pid, tid);
        if (toDo !== null) {
            toDo.updateTitle(title);
        }
    }
    updatePriority(pid, tid, priority) {
        const toDo = this.getToDo(pid, tid);
        if (toDo !== null) {
            toDo.updatePriority(priority);
        }
    }
    updateDescription(pid, tid, description) {
        const toDo = this.getToDo(pid, tid);
        if (toDo !== null) {
            toDo.updateDescription(description);
        }
    }
    updateDate(pid, tid, date) {
        const toDo = this.getToDo(pid, tid);
        if (toDo !== null) {
            toDo.updateDate(date);
        }
    }
    addToChecklist(pid, tid, item) {
        const project = this.getProject(pid);
        if (project !== null) {
            project.addToChecklist(tid, item);
        }
    }
    removeFromChecklist(pid, tid, item) {
        const project = this.getProject(pid);
        if (project !== null) {
            project.removeFromChecklist(tid, item);
        }
    }
}

class ToDoApp {
    #toDoManager;
    
    constructor() {
        this.#toDoManager = new ToDoManager();
    }

    #projectUI(p) {
        return {name: p.getName(), pid : p.getId()};
    }
    #toDoUI(toDo) {
        const date = toDo.getDate();
        //months are zero indexed 
        const month = (date.getMonth() + 1).toString();
        const day = date.getDate().toString();
        //date values for input[type=date] require the format to be: yyyy-mm-dd
        //adding neccessary zero padding if required
        return {
            id: toDo.getId(),
            title: toDo.getTitle(),
            description: toDo.getDescription(),
            priority: toDo.getPriority(),
            date: `${date.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        };
    }
    getProjects() {
        return this.#toDoManager.getProjects().map(this.#projectUI);
    }
    getProject(pid) {
        const project = this.#toDoManager.getProject(pid);
        if (project === null) {
            return null
        }
        return this.#projectUI(project);
    }
     addProject(name) {
        const project = this.#toDoManager.addProject(name);
        return this.#projectUI(project);
    }
    //Not sure what UI sends here
    addToDo(pid, title, description, priority, date) {
        const toDo = this.#toDoManager.addToDo(pid, title, description, priority, date);
        return this.#toDoUI(toDo);
    }
    removeToDo(pid, tid) {
        this.#toDoManager.removeToDo(pid, tid);
    }
   
    getToDos(pid) {
        const project = this.#toDoManager.getProject(pid);
        if (project !== null) {
            return project.getToDos().map((t) => this.#toDoUI(t));
        }
        return null;
    }
    getToDo(pid, tid) {
        const toDo = this.#toDoManager.getToDo(pid, tid);
        if (toDo !== null) {
            return this.#toDoUI(toDo)
        }
        return null;
    }
    updatePriority(pid, tid, priority) {
        this.#toDoManager.updatePriority(pid, tid, priority);
    }
    updateTitle(pid, tid, title) {
        this.#toDoManager.updateTitle(pid, tid, title);
    }
    updateDescription(pid, tid, description) {
        this.#toDoManager.updateDescription(pid, tid, description);
    }
    addToChecklist(pid, tid, item) {
        this.#toDoManager.addToChecklist(pid, tid, item);
    }
    removeFromChecklist(pid, tid, item) {
        this.#toDoManager.removeFromChecklist(pid, tid, item);
    }
    updateDate(pid, tid, dateString) {
        const [y, m, d] = dateString.split("-").map(Number);
        this.#toDoManager.updateDate(pid, tid, new Date(y, m - 1, d));
    }
    formatDate(dateStr) {
        const [y, m, d] = dateStr.split("-").map(Number);
        return format(new Date(y, m - 1, d), "PPP");
    }
    
}

class Finder {
    static binSearch(arr, targetValue) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const currVal = arr[mid].getId();
            if (currVal === targetValue) {
                return mid;
            } else if (currVal < targetValue) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return -1;
    }
}

export default ToDoApp;