const list      = document.querySelector("#taskList");
const button    = document.querySelector("#addBtn");
const input     = document.querySelector("#itemInput");
const counter   = document.querySelector("#counter");

let totalCount = 0;

function updateCounter() {
    const total = list.querySelectorAll("li").length;
    const done  = list.querySelectorAll("li.done").length;
    counter.textContent = `Всего: ${total} • Выполнено: ${done}`;
}

function updateEmptyState() {
    const existing = list.querySelector(".empty");
    if (list.querySelectorAll("li").length === 0 && !existing) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "📝 Список пуст. Добавьте первую покупку!";
        list.append(empty);
    } else if (list.querySelectorAll("li").length > 0 && existing) {
        existing.remove();
    }
}

function addItem() {
    const text = input.value.trim();

    if (text === "") {
        input.style.borderColor = "#e74c3c";
        input.focus();
        return;
    }

    input.style.borderColor = "#ccc";

    const item = document.createElement("li");
    item.textContent = text;

    item.addEventListener("click", () => {
        item.classList.toggle("done");
        updateCounter();
    });

    list.append(item);
    input.value = "";
    input.focus();

    totalCount++;
    updateEmptyState();
    updateCounter();
}

button.addEventListener("click", addItem);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addItem();
});

input.addEventListener("input", () => {
    input.style.borderColor = "#ccc";
});

updateEmptyState();
updateCounter();