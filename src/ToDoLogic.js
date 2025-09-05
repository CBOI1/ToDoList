
class ToDo {
    #title;
    #description;
    #dueDate;
    #priority;
    #id;
    #projectId;
    constructor(title, description, priority, id) {
        this.#title = title;
        this.#description = description;
        this.#priority = priority;
        this.#id
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

    getToDo(id) {
        const toDoIndex = Finder.binSearch(this.#toDoList, id, (toDo) => toDo.getId())
        return (toDoIndex === -1) ? null : this.#toDoList[toDoIndex];
    }

    getToDos() {
        return this.#toDoList;
    }

    addToDo(title, description, priority) {
        let newToDo = new ToDo(title, description, priority, this.#counter++);
        this.#toDoList.push(newToDo)
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
        this.addProject("Default Project");
        this.#projects[0].addToDo("Default ToDo");
    }
    addProject(name) {
        const projectID = this.#counter++;
        const newProject = new Project(name, projectID);
        this.#projects.push(newProject);
        return newProject;
    }
    removeProject(id) {
        //#projects ID's are in strictly increasing order
        //use binary search
        const indexToRemove = Finder.binSearch(this.#projects, id, (project) => project.getId());
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
    getToDo(pid, tid) {
        const project = this.getProject(pid);
        return project === null ? null : project.getToDo(tid);
    }

    getProject(projectId) {
        const projectIndex = Finder.binSearch(this.#projects, projectId, (p) => p.getId())
        return projectIndex === -1 ? null : this.#projects[projectIndex];
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
            description: toDo.getDescription()
        };
    }
    getProjects() {
        return this.#toDoManager.getProjects().map(this.#projectUI);
    }
    addToDo(pid, toDo) {
        const project = this.#toDoManager.getProject(pid);
        if (project !== null) {
            project.addToDo(toDo);
        }
    }
    addProject(name) {
        const project = this.#toDoManager.addProject(name);
        return this.#projectUI(project);
    }
    getToDos(pid) {
        const project = this.#toDoManager.getProject(pid);
        if (project !== null) {
            return project.getToDos().map((t) => this.#toDoUI(t));
        }
        return null;
    }
}

class Finder {
    static binSearch(arr, targetValue, getTargetValue) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (getTargetValue(arr[mid]) == targetValue) {
                return mid;
            } else if (getTargetValue(arr[mid]) < targetValue) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return -1;
    }
}

export default ToDoApp;