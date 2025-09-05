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
        this.#doc.body.innerHtml = "";
        this.#doc.body.append(header, content);
    }

    showProjects() {
        this.#clearContent()
        const form = this.#createProjectInputForm();
    
        const content = this.#doc.querySelector("div.content");
        const scrollContent = this.#doc.createElement("div");
        scrollContent.classList.add("scroll-content");
        scrollContent.appendChild(this.#createList(
            this.#toDoApp.getProjects(),
            this.#addProject
        ));
        content.append(scrollContent);

        content.parentNode.insertBefore(form, content);
    }
    //creates and returns ul containing list of projects
    #createList(elements, addElement) {
        const unorderedList = this.#doc.createElement("ul");
        for (const element of elements) {
            addElement(this, unorderedList, element);
        }
        return unorderedList;
    }
    //add project to list of projects in UI and Logic
    #addProject(obj, list, project) {
        const projectNode = obj.#doc.createElement("button");
        const li = obj.#doc.createElement("li");
        li.appendChild(projectNode);
        const {name, pid} = project;
        projectNode.textContent = name;
        projectNode.dataset.id = pid;
        list.append(li);
    }
    #addToDo(obj, list, toDo) {
        const toDoNode = obj.#doc.createElement("button");
        const li = obj.#doc.createElement("li");
        const {id, title, description} = toDo;
        toDoNode.textContent = title;
        toDoNode.dataset.id = id;
        toDoNode.dataset.description = description;
        toDoNode.addEventListener("click", () => {

        });
        li.appendChild(toDoNode);
        list.appendChild(li);
    }

    #showToDos(pid) {
        this.#clearContent();
        const content = this.#doc.querySelector(".content");
        const toDos = this.#toDoApp.getToDos(pid);
        //store pid on page to be able to get a reference to project
        const header = this.#doc.querySelector("header");
        header.dataset.pid = pid;
        //create list of toDos
        content.appendChild(this.#createList(toDos, this.#addToDo));
    }

    #createProjectInputForm() {
        const form = this.#doc.createElement("form");
        const nameInput = this.#doc.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("placeholder", "Project Name")

        const submitButton = this.#doc.createElement("button");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "button";
        submitButton.addEventListener("click", () => {
            const userInput = this.#doc.querySelector("form input");
            if (userInput.value === "") {
                return;
            }
            const list = this.#doc.querySelector("ul");
            const project = this.#toDoApp.addProject(userInput.value);
            this.#addProject(this, list, project);
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

