const list     = document.querySelector("#taskList");
const button   = document.querySelector("#addBtn");
const input    = document.querySelector("#itemInput");
const counter  = document.querySelector("#counter");
const searchEl = document.querySelector("#searchInput");

let totalCount = 0;

function updateCounter() {
    const total = list.querySelectorAll("li").length;
    const done  = list.querySelectorAll("li.done").length;
    counter.textContent = `Всего: ${total} • Выполнено: ${done}`;
}

function updateEmptyState() {
    const existing = list.querySelector(".empty");
    const items = list.querySelectorAll("li").length;
    const message = searchEl.value.trim() !== ""
        ? "🔍 Ничего не найдено"
        : "📝 Список пуст. Добавьте первую покупку!";

    if (items === 0 && !existing) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = message;
        list.append(empty);
    } else if (items > 0 && existing) {
        existing.remove();
    } else if (items === 0 && existing) {
        existing.textContent = message;
    }
}

function filterItems() {
    const query = searchEl.value.trim().toLowerCase();
    const items = list.querySelectorAll("li");

    for (let i = 0; i < items.length; i++) {
        const text = items[i].textContent.toLowerCase();
        if (text.includes(query)) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
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
    filterItems();
}

button.addEventListener("click", addItem);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addItem();
});

input.addEventListener("input", () => {
    input.style.borderColor = "#ccc";
});

searchEl.addEventListener("input", filterItems);

updateEmptyState();
updateCounter();