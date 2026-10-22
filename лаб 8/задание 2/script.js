const list          = document.querySelector("#taskList");
const addBtn        = document.querySelector("#addBtn");
const input         = document.querySelector("#taskInput");
const clearBtn      = document.querySelector("#clearBtn");
const counter       = document.querySelector("#counter");
const storageSelect = document.querySelector("#storageSelect");
const exportBtn     = document.querySelector("#exportBtn");
const importBtn     = document.querySelector("#importBtn");
const fileInput     = document.querySelector("#fileInput");

const STORAGE_KEY = "todo_tasks";
let currentStorage = "localStorage";

function getStorage() {
    return currentStorage === "localStorage" ? localStorage : sessionStorage;
}

function loadTasks() {
    const raw = getStorage().getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
    getStorage().setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getTasksFromDOM() {
    const items = list.querySelectorAll("li");
    const tasks = [];
    for (let i = 0; i < items.length; i++) {
        tasks.push({
            text: items[i].querySelector(".task-text").textContent,
            done: items[i].classList.contains("done")
        });
    }
    return tasks;
}

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

function createTaskElement(text, done) {
    const li = document.createElement("li");
    if (done) li.classList.add("done");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Удалить";

    span.addEventListener("click", () => {
        li.classList.toggle("done");
        saveTasks(getTasksFromDOM());
        updateCounter();
    });

    delBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        li.remove();
        saveTasks(getTasksFromDOM());
        updateEmptyState();
        updateCounter();
    });

    li.append(span);
    li.append(delBtn);
    return li;
}

function renderTasks(tasks) {
    list.innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
        list.append(createTaskElement(tasks[i].text, tasks[i].done));
    }
    updateEmptyState();
    updateCounter();
}

function addTask() {
    const text = input.value.trim();

    if (text === "") {
        input.style.borderColor = "#e74c3c";
        input.focus();
        return;
    }

    input.style.borderColor = "#ccc";
    list.append(createTaskElement(text, false));
    input.value = "";
    input.focus();

    saveTasks(getTasksFromDOM());
    updateEmptyState();
    updateCounter();
}

function clearCompleted() {
    const completed = list.querySelectorAll("li.done");
    for (let i = 0; i < completed.length; i++) {
        completed[i].remove();
    }
    saveTasks(getTasksFromDOM());
    updateEmptyState();
    updateCounter();
}

function exportJSON() {
    const tasks = getTasksFromDOM();
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "todo-tasks.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importJSON(file) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        try {
            const tasks = JSON.parse(reader.result);
            if (!Array.isArray(tasks)) throw new Error("Ожидается массив");

            renderTasks(tasks);
            saveTasks(tasks);
        } catch (err) {
            alert("Ошибка импорта: " + err.message);
        }
    });

    reader.readAsText(file);
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
});

input.addEventListener("input", () => {
    input.style.borderColor = "#ccc";
});

clearBtn.addEventListener("click", clearCompleted);

exportBtn.addEventListener("click", exportJSON);

importBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        importJSON(fileInput.files[0]);
        fileInput.value = "";
    }
});

storageSelect.addEventListener("change", () => {
    currentStorage = storageSelect.value;
    const tasks = loadTasks();
    renderTasks(tasks);
});

const savedMode = localStorage.getItem("todo_storage_mode");
if (savedMode === "sessionStorage") {
    currentStorage = "sessionStorage";
    storageSelect.value = "sessionStorage";
}

renderTasks(loadTasks());