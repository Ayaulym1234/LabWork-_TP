const STORAGE_KEY = "kanban_board_data";
const STATUSES = ["plan", "doing", "done"];

const newTaskInput = document.getElementById("newTask");
const addBtn       = document.getElementById("addBtn");
const storageMode  = document.getElementById("storageMode");
const exportBtn    = document.getElementById("exportBtn");
const importBtn    = document.getElementById("importBtn");
const importFile   = document.getElementById("importFile");
const clearBtn     = document.getElementById("clearBtn");
const toast        = document.getElementById("toast");

let tasks = [];
let taskIdCounter = 1;

function getStorage() {
    return storageMode.value === "session" ? sessionStorage : localStorage;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

function saveData() {
    try {
        getStorage().setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        showToast("Ошибка сохранения: " + e.message);
    }
}

function loadData() {
    const raw = getStorage().getItem(STORAGE_KEY);
    if (!raw) {
        tasks = [];
        taskIdCounter = 1;
        return;
    }
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            tasks = parsed;
            taskIdCounter = tasks.reduce((max, t) => Math.max(max, t.id || 0), 0) + 1;
        }
    } catch (e) {
        showToast("Ошибка чтения данных");
        tasks = [];
    }
}

function createCard(task) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.id = task.id;

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "×";
    del.title = "Удалить";

    card.append(text);
    card.append(del);

    card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", String(task.id));
        e.dataTransfer.effectAllowed = "move";
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });

    del.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveData();
        render();
        showToast("Задача удалена");
    });

    return card;
}

function render() {
    for (const status of STATUSES) {
        const container = document.getElementById("cards-" + status);
        container.innerHTML = "";
        const filtered = tasks.filter(t => t.status === status);

        if (filtered.length === 0) {
            const hint = document.createElement("div");
            hint.className = "empty-hint";
            hint.textContent = "Перетащите карточку сюда";
            container.append(hint);
            continue;
        }

        for (let i = 0; i < filtered.length; i++) {
            container.append(createCard(filtered[i]));
        }
    }
}

function setupDropZones() {
    const columns = document.querySelectorAll(".column");

    for (const column of columns) {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            column.classList.add("drag-over");
        });

        column.addEventListener("dragleave", () => {
            column.classList.remove("drag-over");
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault();
            column.classList.remove("drag-over");

            const id = Number(e.dataTransfer.getData("text/plain"));
            const newStatus = column.dataset.status;
            const task = tasks.find(t => t.id === id);

            if (task && task.status !== newStatus) {
                task.status = newStatus;
                saveData();
                render();
                showToast(`Перемещено в «${column.querySelector("h2").textContent}»`);
            }
        });
    }
}

function addTask() {
    const text = newTaskInput.value.trim();
    if (text === "") {
        newTaskInput.style.borderColor = "#e74c3c";
        newTaskInput.focus();
        return;
    }

    newTaskInput.style.borderColor = "#ccc";

    tasks.push({
        id: taskIdCounter++,
        text: text,
        status: "plan"
    });

    newTaskInput.value = "";
    newTaskInput.focus();
    saveData();
    render();
    showToast("Задача добавлена");
}

function exportJSON() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Файл экспортирован");
}

function importJSON(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!Array.isArray(parsed)) throw new Error("Ожидается массив задач");

            const valid = parsed.filter(t =>
                t && typeof t.text === "string" &&
                STATUSES.includes(t.status)
            );

            if (valid.length === 0) throw new Error("Нет валидных задач");

            tasks = valid.map((t, idx) => ({
                id: idx + 1,
                text: t.text,
                status: t.status
            }));
            taskIdCounter = tasks.length + 1;

            saveData();
            render();
            showToast(`Импортировано задач: ${tasks.length}`);
        } catch (err) {
            showToast("Ошибка импорта: " + err.message);
        }
    };

    reader.readAsText(file);
}

addBtn.addEventListener("click", addTask);

newTaskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

newTaskInput.addEventListener("input", () => {
    newTaskInput.style.borderColor = "#ccc";
});

storageMode.addEventListener("change", () => {
    saveData();
    loadData();
    render();
    showToast("Хранилище: " + storageMode.value);
});

exportBtn.addEventListener("click", exportJSON);

importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) importJSON(file);
    importFile.value = "";
});

clearBtn.addEventListener("click", () => {
    if (!confirm("Удалить все задачи?")) return;
    tasks = [];
    taskIdCounter = 1;
    getStorage().removeItem(STORAGE_KEY);
    render();
    showToast("Доска очищена");
});

setupDropZones();
loadData();
render();