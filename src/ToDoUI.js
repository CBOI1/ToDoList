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
        this.#doc.body.innerHTML = "";
        this.#doc.body.append(header, content);
    }

    showProjects() {
        this.#clearContent();
        const form = this.#createSimpleForm("Project Name", this.#createProjectCallback);
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
            this.#displayProject(pid);
        });
    }
    //add toDo to the UI
    #addToDo = (toDo) => {
        const list = this.#doc.querySelector("ul");
        const toDoNode = this.#doc.createElement("button");
        const li = this.#doc.createElement("li");
        const {id, title, description, priority} = toDo;
        toDoNode.dataset.tid = id;
        toDoNode.textContent = title;
        toDoNode.addEventListener("click", () => {
            //expand toDo and show details
            //TODO: need to change this I believe not sure
            const dialog = this.#doc.querySelector("dialog");
            dialog.dataset.tid = id;
            this.#fillDialog(id)
            dialog.showModal();
        });
        li.appendChild(toDoNode);
        list.appendChild(li);
    }
    //show all ToDo's for associated PID that exist in model
    #showToDos(pid) {
        const content = this.#doc.querySelector(".content");
        const ul = this.#doc.createElement("ul");
        content.appendChild(ul);
        
        //create list of toDos
        this.#addElements(this.#toDoApp.getToDos(pid), this.#addToDo);
        content.appendChild(ul);
    }
    //creates UI to display a specfic project's content and other UI elements
    #displayProject(pid) {
        this.#clearContent();
        const dialog = this.#createInputDialog(pid);
        this.#doc.body.appendChild(dialog);
        const container = this.#doc.createElement("div");
        container.classList.add("header-container");
        //place header container before content
        const header = this.#doc.querySelector("header");
        this.#doc.body.insertBefore(container, header.nextSibling);
        //store pid on page to be able to get a reference to project
        header.dataset.pid = pid;
        container.appendChild(header);
        //add form element for adding ToDos
        const addButton = this.#doc.createElement("button");
        const buttonDiv = this.#doc.createElement("div");
        buttonDiv.appendChild(addButton);
        addButton.textContent = "Create ToDo";
        this.#doc.body.insertBefore(buttonDiv, container.nextSibling);
        addButton.addEventListener("click", () => {
            dialog.dataset.tid = -1;
            dialog.querySelector("form").reset();
            dialog.showModal();
        });
        const exitButton = this.#doc.createElement("button");
        exitButton.setAttribute("type", "button");
        exitButton.textContent = "x";
        exitButton.addEventListener("click", () => {
            this.showProjects();
        });
        container.appendChild(exitButton);
        this.#showToDos(pid);
    }

    #createProjectCallback = () => {
        const userInput = this.#doc.querySelector("form input");
        if (userInput.value === "") {
            return;
        }
        const project = this.#toDoApp.addProject(userInput.value);
        this.#addProject(project);
        userInput.value = "";
    }

    #createSimpleForm(placeHolder, submitHandler) {
        const form = this.#doc.createElement("form");
        const textInput = this.#doc.createElement("input");
        textInput.setAttribute("type", "text");
        textInput.setAttribute("placeholder", placeHolder);
        const submitButton = this.#doc.createElement("button");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "+";
        submitButton.addEventListener("click", submitHandler);
        form.append(textInput, submitButton)
        return form
    }

    #createInputDialog(pid) {
        const dialog = this.#doc.createElement("dialog");
        dialog.dataset.pid = pid;
        const form = this.#doc.createElement("form");
        const nameDiv = this.#createLabeledInput("text", "title", "Title: ");
        const priorityDiv = this.#createLabeledInput("range", "priority", "Priority: ");
        const priorityInput = priorityDiv.querySelector("input");
        priorityInput.setAttribute("min", "1");
        priorityInput.setAttribute("max", "10");
        const textareaDiv = this.#createLabeledInput("textarea", "description", "Description: ");
        const confirm = this.#createInputElement("button", "confirm");
        confirm.setAttribute("type", "button");
        confirm.addEventListener("click", this.#confirmCallBack);
        const confirmDiv = this.#doc.createElement("div")
        confirmDiv.appendChild(confirm);
        confirm.textContent = "confirm";
        form.append(nameDiv, priorityDiv, textareaDiv, confirmDiv);
        dialog.appendChild(form);
        return dialog;
    }

    #fillDialog(tid) {
        const pid = parseInt(this.#doc.querySelector("header").dataset.pid);
        //add relevant todo state as intial values 
        const dialog = this.#doc.querySelector("dialog");
        const title = dialog.querySelector('input[id="title"]');
        const priority = dialog.querySelector('input[id="priority"]')
        const textArea = dialog.querySelector('textarea[id="description"]')
        const toDo = this.#toDoApp.getToDo(pid, tid);
        title.value = toDo.title;
        priority.value = toDo.priority;
        textArea.value = toDo.description;
    }

    #confirmCallBack = (event) => {
        const dialog = this.#doc.querySelector("dialog");
        const header = this.#doc.querySelector("header");
        const tid = parseInt(dialog.dataset.tid);
        const pid = parseInt(header.dataset.pid);
        //read inputs and update the 
        const title = this.#doc.querySelector('input[id="title"]');
        const priority = this.#doc.querySelector('input[id="priority"]');
        const description = this.#doc.querySelector('textarea[id=description]');
        if (tid >= 0) {
            this.#toDoApp.updateDescription(pid, tid, description.value);
            this.#toDoApp.updateTitle(pid, tid, title.value);
            this.#toDoApp.updatePriority(pid, tid, priority.value);
            const toDoButton = this.#doc.querySelector(`button[data-tid="${tid}"]`);
            toDoButton.textContent = title.value;
        } else {
            const toDo = this.#toDoApp.addToDo(pid, title.value, description.value, priority.value);
            this.#addToDo(toDo);
        }
        dialog.close();
    }
    
    //either returns an input with specific type
    #createInputElement(typeOfInput, id) {
        let input; 
        if (typeOfInput === "textarea" || typeOfInput === "button") {
            input = this.#doc.createElement(typeOfInput);
        } else {
            input = this.#doc.createElement("input");
            input.setAttribute("type", typeOfInput);
        }
        input.setAttribute("id", id);
        return input;
    }
    #createLabelFor(inputElement, content) {
        const label = this.#doc.createElement("label");
        label.setAttribute("for", inputElement.id);
        label.textContent = content;
        return label;
    }
    #createLabeledInput(typeOfInput, id, label) {
        const input = this.#createInputElement(typeOfInput, id);
        const labelForInput = this.#createLabelFor(input, label);
        const div = this.#doc.createElement("div");
        div.append(labelForInput, input);
        return div;
    }

}




function setUpWebpage() {
    document.addEventListener("DOMContentLoaded", (e) => {
        (new ToDoUI(document)).showProjects();
    });
}


setUpWebpage();

