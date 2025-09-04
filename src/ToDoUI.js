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
        content.innerHTML = "";
    }

    showProjects() {
        this.#clearContent()
        const form = this.#createProjectInputForm();
    
        const content = this.#doc.querySelector("div.content");
        const scrollContent = this.#doc.createElement("div");
        scrollContent.classList.add("scroll-content");
        scrollContent.appendChild(this.#createProjectList());
        content.append(scrollContent);

        content.parentNode.insertBefore(form, content);
    }
    //creates and returns ul containing list of projects
    #createProjectList() {
        const projects = this.#toDoApp.getProjects();
        const unorderedList = this.#doc.createElement("ul");
        for (const project of projects) {
            this.#addProject(unorderedList, project);
        }
        return unorderedList;
    }
    #addProject(list, project) {
        const projectNode = this.#doc.createElement("button");
        const li = this.#doc.createElement("li");
        li.appendChild(projectNode);
        const {name, pid} = project;
        projectNode.textContent = name;
        projectNode.dataset.id = pid;
        list.append(li);
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
            this.#addProject(list, project);
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

