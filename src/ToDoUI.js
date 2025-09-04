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

    clearContent() {
        const content = this.#doc.querySelector(".content");
        content.innerHTML = "";
    }

    showProjects() {
        //get projects and add them to the dom
        const projects = this.#toDoApp.getProjects();
        const content = this.#doc.querySelector("div.content");
        const scrollContent = this.#doc.createElement("div");
        scrollContent.classList.add("scrollContent");
        const unorderedList = this.#doc.createElement("ul");
        scrollContent.appendChild(unorderedList);
        for (const project of projects) {
            const projectNode = this.#doc.createElement("button");
            const {name, pid} = project;
            projectNode.textContent = name;
            projectNode.dataset.id = pid;
            unorderedList.append(projectNode);
        }
        content.append(scrollContent);
    }

}

function setUpWebpage() {
    document.addEventListener("DOMContentLoaded", (e) => {
        (new ToDoUI(document)).showProjects();
    });
}

setUpWebpage();

