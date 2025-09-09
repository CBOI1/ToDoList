import "./styles.css";
import ToDoApp from "./ToDoLogic.js"
//http://localhost:8080/
class ToDoUI {
    #toDoApp;
    #doc;
    constructor(doc) {
        this.#toDoApp = new ToDoApp();
        this.#doc = doc;
    }

    #clearContent() {
        const content = this.#doc.querySelector(".content");
        const header = this.#doc.querySelector("header");
        delete header.dataset.pid;
        content.innerHTML = "";
        console.log(content.childNodes);
        this.#doc.body.innerHTML = "";
        this.#doc.body.append(header, content);
    }

    showProjects() {
        this.#clearContent();
        const form = this.#createProjectInputForm();
        const content = this.#doc.querySelector("div.content");
        const list = this.#doc.createElement("ul");
        content.appendChild(list);
        this.#addElements(
            this.#toDoApp.getProjects(),
            this.#addProject
        );
        content.parentNode.insertBefore(form, content);
    }
    //creates and returns ul containing list of provided elements
    #addElements(elements, addElement) {
        for (const element of elements) {
            addElement(element);
        }
    }
    //add project to UI
    #addProject = (project) => {
        const list = this.#doc.querySelector("ul");
        const projectNode = this.#doc.createElement("button");
        const li = this.#doc.createElement("li");
        li.appendChild(projectNode);
        const {name, pid} = project;
        projectNode.textContent = name;
        projectNode.dataset.id = pid;
        list.appendChild(li);
        projectNode.addEventListener("click", (event) => {
            const pid = parseInt(event.currentTarget.dataset.id);
            //diplay list of project's ToDo's
            this.#showToDos(pid);
        });
    }
    //add toDo to the UI
    #addToDo = (toDo) => {
        const list = this.#doc.querySelector("ul");
        const toDoNode = this.#doc.createElement("button");
        const li = this.#doc.createElement("li");
        const {id, title, description} = toDo;
        toDoNode.textContent = title;
        toDoNode.dataset.id = id;
        toDoNode.dataset.description = description;
        toDoNode.addEventListener("click", () => {
            //TODO: expand toDo and show details
            return;
        });
        li.appendChild(toDoNode);
        list.appendChild(li);
    }
    //show all ToDo's for associated PID that exist in model
    #showToDos(pid) {
        this.#clearContent();
        const content = this.#doc.querySelector(".content");
        const ul = this.#doc.createElement("ul");
        content.appendChild(ul);
        const toDos = this.#toDoApp.getToDos(pid);
        //store pid on page to be able to get a reference to project
        const header = this.#doc.querySelector("header");
        header.dataset.pid = pid;
        //create list of toDos
        this.#addElements(this.#toDoApp.getToDos(pid), this.#addToDo);
        content.appendChild(ul);
    }

    #createProjectInputForm() {
        const form = this.#doc.createElement("form");
        const nameInput = this.#doc.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("placeholder", "Project Name");

        const submitButton = this.#doc.createElement("button");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "+";
        submitButton.addEventListener("click", () => {
            const userInput = this.#doc.querySelector("form input");
            if (userInput.value === "") {
                return;
            }
            const list = this.#doc.querySelector("ul");
            const project = this.#toDoApp.addProject(userInput.value);
            this.#addProject(project);
            userInput.value = "";
        });
        form.append(nameInput, submitButton);


        return form;
    }
}



function setUpWebpage() {
    document.addEventListener("DOMContentLoaded", (e) => {
        (new ToDoUI(document)).showProjects();
    });
}

setUpWebpage();

