const list     = document.querySelector("#taskList");
const addBtn   = document.querySelector("#addBtn");
const input    = document.querySelector("#taskInput");
const clearBtn = document.querySelector("#clearBtn");
const counter  = document.querySelector("#counter");

function updateCounter() {
    const total = list.querySelectorAll("li").length;
    const done  = list.querySelectorAll("li.done").length;
    counter.textContent = `Задач: ${total} • Выполнено: ${done}`;
}

function updateEmptyState() {
    const existing = list.querySelector(".empty");
    const items = list.querySelectorAll("li").length;

    if (items === 0 && !existing) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "Список пуст. Добавьте первую задачу!";
        list.append(empty);
    } else if (items > 0 && existing) {
        existing.remove();
    }
}

function createTask(text) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Удалить";

    li.append(span);
    li.append(delBtn);
    return li;
}

function addTask() {
    const text = input.value.trim();

    if (text === "") {
        input.style.borderColor = "#e74c3c";
        input.focus();
        return;
    }

    input.style.borderColor = "#ccc";

    const li = createTask(text);

    li.querySelector(".task-text").addEventListener("click", () => {
        li.classList.toggle("done");
        updateCounter();
    });

    li.querySelector(".delete-btn").addEventListener("click", (event) => {
        event.stopPropagation();
        li.remove();
        updateEmptyState();
        updateCounter();
    });

    list.append(li);
    input.value = "";
    input.focus();

    updateEmptyState();
    updateCounter();
}

function clearCompleted() {
    const completed = list.querySelectorAll("li.done");
    for (let i = 0; i < completed.length; i++) {
        completed[i].remove();
    }
    updateEmptyState();
    updateCounter();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
});

input.addEventListener("input", () => {
    input.style.borderColor = "#ccc";
});

clearBtn.addEventListener("click", clearCompleted);

updateEmptyState();
updateCounter();