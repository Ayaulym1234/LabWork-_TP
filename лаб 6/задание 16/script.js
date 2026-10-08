const input   = document.querySelector("#taskInput");
const addBtn  = document.querySelector("#addBtn");

const columns = {
    new:  document.querySelector("#col-new"),
    work: document.querySelector("#col-work"),
    done: document.querySelector("#col-done")
};

const counters = {
    new:  document.querySelector("#count-new"),
    work: document.querySelector("#count-work"),
    done: document.querySelector("#count-done")
};

const statusLabels = {
    new:  "Новые",
    work: "В работе",
    done: "Готово"
};

let taskId = 0;

function updateCounters() {
    for (const key in columns) {
        const count = columns[key].querySelectorAll(".card").length;
        counters[key].textContent = count;
        updateEmptyState(key);
    }
}

function updateEmptyState(status) {
    const container = columns[status];
    const existing = container.querySelector(".empty");
    const cards = container.querySelectorAll(".card").length;

    if (cards === 0 && !existing) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "Пусто";
        container.append(empty);
    } else if (cards > 0 && existing) {
        existing.remove();
    }
}

function createCard(text, status) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = ++taskId;

    const cardText = document.createElement("div");
    cardText.className = "card-text";
    cardText.textContent = text;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    if (status !== "new") {
        const leftBtn = document.createElement("button");
        leftBtn.className = "btn-left";
        leftBtn.textContent = "◀ " + statusLabels[status === "done" ? "work" : "new"];
        leftBtn.addEventListener("click", () => moveCard(card, getPrevStatus(status)));
        actions.append(leftBtn);
    }

    if (status !== "done") {
        const rightBtn = document.createElement("button");
        rightBtn.className = "btn-right";
        rightBtn.textContent = statusLabels[status === "new" ? "work" : "done"] + " ▶";
        rightBtn.addEventListener("click", () => moveCard(card, getNextStatus(status)));
        actions.append(rightBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.className = "btn-delete";
    delBtn.textContent = "🗑";
    delBtn.addEventListener("click", () => {
        card.remove();
        updateCounters();
    });
    actions.append(delBtn);

    card.append(cardText);
    card.append(actions);
    return card;
}

function getNextStatus(status) {
    if (status === "new")  return "work";
    if (status === "work") return "done";
    return "done";
}

function getPrevStatus(status) {
    if (status === "done") return "work";
    if (status === "work") return "new";
    return "new";
}

function moveCard(card, newStatus) {
    const text = card.querySelector(".card-text").textContent;
    const newCard = createCard(text, newStatus);
    card.replaceWith(newCard);
    updateCounters();
}

function addTask() {
    const text = input.value.trim();

    if (text === "") {
        input.style.borderColor = "#e74c3c";
        input.focus();
        return;
    }

    input.style.borderColor = "#ccc";

    const card = createCard(text, "new");
    columns.new.append(card);

    input.value = "";
    input.focus();

    updateCounters();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
});

input.addEventListener("input", () => {
    input.style.borderColor = "#ccc";
});

updateCounters();