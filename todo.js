//Tüm elementleri seçme

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");

const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];

const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {   // tüm eventListeners

    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz? ")) {
        //Arayüzden todoları silme:
        // todoList.innerHTML = "";   //Yavaş yöntem

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();

    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {
            // Bulamadı

            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    });
}

function deleteTodo(e) {

    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "To-Do başarıyla silindi...")
    }
}

function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1);      // Array'den değeri silebiliriz.
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}

function addTodo(e) {
    const newTodo = todoInput.value.trim(); //trim : gereksiz boşlukları siler.

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir To-Do girin!");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "To-Do başarıyla eklendi...");
    }
    e.preventDefault();  // Default özellikleri sıfırlıyoruz.
}


function getTodosFromStorage() { // Storagedan Todoları almış olacak.

    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}


function addTodoToStorage(newTodo) {

    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function showAlert(type, message) {

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    // setTimeOut Method
    setTimeout(function () {
        alert.remove();
    }, 1000);
}


function addTodoToUI(newTodo) {  //String değerini list item olarak UI'ya ekleyecek

    //List Item oluşturma
    const listItem = document.createElement("li");

    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    listItem.className = "list-group-item d-flex justify-content-between";

    //Text Node Ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo List'e List Item ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}
