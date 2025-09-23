

class ToDo {
    #title;
    #description;
    #dueDate;
    #priority;
    #id;
    #checklist;

    constructor(title, description, priority, id) {
        this.#title = title;
        this.#description = description;
        this.#priority = priority;
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

    addToDo(title, description, priority) {
        let newToDo = new ToDo(title, description, priority, this.#counter++);
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
    addToDo(pid, title, description, priority) {
        const project = this.getProject(pid);
        if (project !== null) {
            return project.addToDo(title, description, priority);
        }
        return null
    }
    removeToDo(pid, tid) {
        const project = this.getProject(pid);
        if (project !== null) {
            return project.removeToDo(tid);
        }
        project.removeToDo(tid);
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
    updatePriortiy(pid, tid, priority) {
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
        return {
            id: toDo.getId(),
            title: toDo.getTitle(),
            description: toDo.getDescription(),
            priority: toDo.getPriority()
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
    addToDo(pid, title, description, priority) {
        const toDo = this.#toDoManager.addToDo(pid, title, description, priority);
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
        this.#toDoManager.updatePriortiy(pid, tid, priority);
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