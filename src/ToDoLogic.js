

class ToDo {
    #title;
    #description;
    #dueDate;
    #priority;
    #id;
    #projectId;
    constructor(title, description, priority, idData) {
        this.#title = title;
        this.#description = description;
        this.#priority = priority;
        [this.#id, this.#projectId] = idData;
    }
    getIdData() {
        return [this.#id, this.#projectId];
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
        let newToDo = new ToDo(title, description, priority, [this.#counter++, this.#id]);
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
    }
    removeProject(id) {
        //Projects ID's are in strictly increasing order
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
    getToDo(idData) {
        const [projectId, toDoId] = idData;
        const project = this.getProject(projectId);
        return project === null ? null : project.getToDo(toDoId);
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

    getProjects() {
        return this.#toDoManager.getProjects().map((p) => ({name: p.getName(), pid : p.getId()}));
    }
    getToDos(projectId) {
        const project = this.#toDoManager.getProject(projectId);
        if (project === null) {
            return null
        } else {
            return project.getToDos().map((toDo) => ({
                idData : toDo.getIdData(), 
                title : toDo.getTitle(),
                description : toDo.getDescription()
            }));
        }
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