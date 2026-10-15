const data = {
    rooms: [
        { id: 1, name: "Ауд. 101", building: "Корпус А", floor: 1, seats: 30, icon: "🏫", equipment: "Проектор, доска" },
        { id: 2, name: "Ауд. 205", building: "Корпус А", floor: 2, seats: 25, icon: "🏫", equipment: "Проектор" },
        { id: 3, name: "Ауд. 310", building: "Корпус Б", floor: 3, seats: 50, icon: "🏛️", equipment: "Проектор, микрофон" },
        { id: 4, name: "Ауд. 412", building: "Корпус Б", floor: 4, seats: 20, icon: "🏫", equipment: "Доска" },
        { id: 5, name: "Компьютерный класс", building: "Корпус В", floor: 2, seats: 15, icon: "💻", equipment: "15 ПК, проектор" },
        { id: 6, name: "Лаборатория физики", building: "Корпус В", floor: 1, seats: 24, icon: "🔬", equipment: "Оборудование" }
    ],
    rules: {
        title: "Правила бронирования аудиторий",
        list: [
            "Бронировать аудиторию можно не более чем на 4 часа подряд.",
            "Запрещается бронировать аудитории задним числом или более чем на 14 дней вперёд.",
            "Время окончания должно быть позже времени начала.",
            "Нельзя создать два пересекающихся бронирования для одной аудитории.",
            "Отменять бронирование рекомендуется не позднее, чем за 2 часа до начала.",
            "При систематических неявках доступ к бронированию может быть ограничен.",
            "Время работы аудиторий: 08:00 – 22:00 ежедневно."
        ],
        note: "⚠️ Система автоматически проверяет пересечение времени. Если выбранный интервал пересекается с существующим бронированием той же аудитории, новая заявка не будет создана."
    }
};

const content   = document.querySelector("#content");
const tabs      = document.querySelectorAll("[data-page]");
const toastEl   = document.querySelector("#toast");
const bookBadge = document.querySelector("#bookBadge");

let bookings = [];
let nextBookingId = 1;

// КЛАВИАТУРНАЯ НАВИГАЦИЯ
function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
        const tag = document.activeElement.tagName;
        const isTyping = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

        // Esc — снять фокус
        if (e.key === "Escape") {
            if (document.activeElement) document.activeElement.blur();
            return;
        }

        // ← / → — переключение вкладок
        if (!isTyping && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
            const tabKeys = ["rooms", "bookings", "rules"];
            const currentIdx = tabKeys.findIndex(k =>
                document.querySelector(`[data-page="${k}"]`).classList.contains("active"));
            const nextIdx = e.key === "ArrowRight"
                ? (currentIdx + 1) % tabKeys.length
                : (currentIdx - 1 + tabKeys.length) % tabKeys.length;

            navigate(tabKeys[nextIdx]);
            document.querySelector(`[data-page="${tabKeys[nextIdx]}"]`).focus();
            e.preventDefault();
            return;
        }

        // Alt+1 / Alt+2 / Alt+3 — быстрый переход
        if (e.altKey && ["1", "2", "3"].includes(e.key)) {
            const tabKeys = ["rooms", "bookings", "rules"];
            const idx = parseInt(e.key, 10) - 1;
            navigate(tabKeys[idx]);
            document.querySelector(`[data-page="${tabKeys[idx]}"]`).focus();
            e.preventDefault();
            return;
        }

        // "/" — фокус на первое поле формы брони
        if (e.key === "/" && !isTyping) {
            const first = document.querySelector(".booking-form input");
            if (first) {
                first.focus();
                e.preventDefault();
            }
        }
    });
}

function focusFirstTab() {
    const first = document.querySelector("[data-page]");
    if (first) first.focus();
}

// УТИЛИТЫ
function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

// ПРОВЕРКА ПЕРЕСЕЧЕНИЯ ВРЕМЕНИ
function isOverlapping(b1, b2) {
    return b1.date === b2.date &&
           b1.roomId === b2.roomId &&
           b1.start < b2.end &&
           b2.start < b1.end;
}

function findConflict(roomId, date, start, end) {
    const candidate = { roomId, date, start, end };
    return bookings.find(b => isOverlapping(candidate, b));
}

// ВАЛИДАЦИЯ
function validateBooking(roomId, date, start, end) {
    if (!date || !start || !end) {
        return "Заполните все поля: дату, время начала и окончания";
    }
    if (timeToMinutes(start) >= timeToMinutes(end)) {
        return "Время окончания должно быть позже времени начала";
    }
    if (timeToMinutes(start) < 8 * 60 || timeToMinutes(end) > 22 * 60) {
        return "Бронирование возможно только в рабочие часы (08:00 – 22:00)";
    }
    if (timeToMinutes(end) - timeToMinutes(start) > 4 * 60) {
        return "Максимальная длительность брони — 4 часа";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    if (bookingDate < today) {
        return "Нельзя бронировать задним числом";
    }
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);
    if (bookingDate > twoWeeks) {
        return "Бронирование возможно не более чем на 14 дней вперёд";
    }

    const conflict = findConflict(roomId, date, start, end);
    if (conflict) {
        return `Аудитория занята с ${conflict.start} до ${conflict.end} (${conflict.title})`;
    }

    return null;
}

// УВЕДОМЛЕНИЯ (TOAST)
let toastTimer = null;
function showToast(message, type = "success") {
    toastEl.textContent = message;
    toastEl.className = "toast " + type + " show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2600);
}

// БРОНИРОВАНИЕ
function addBooking(roomId, date, start, end, title) {
    const error = validateBooking(roomId, date, start, end);
    if (error) {
        showToast(error, "error");
        return false;
    }

    bookings.push({
        id: nextBookingId++,
        roomId, date, start, end,
        title: title || "Без названия"
    });

    updateBookBadge();
    showToast("✅ Бронирование создано", "success");
    return true;
}

function cancelBooking(id) {
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return;
    bookings.splice(idx, 1);
    updateBookBadge();
    navigate("bookings");
    showToast("Бронирование отменено", "success");
}

function updateBookBadge() {
    bookBadge.textContent = `📅 ${bookings.length}`;
}

// РЕНДЕР: АУДИТОРИИ
function renderRooms() {
    const wrap = document.createElement("div");
    wrap.className = "fade-in";

    const grid = document.createElement("div");
    grid.className = "grid";

    data.rooms.forEach(room => {
        const card = document.createElement("div");
        card.className = "room";

        const icon = document.createElement("div");
        icon.className = "room-icon";
        icon.textContent = room.icon;

        const name = document.createElement("h3");
        name.textContent = room.name;

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = `${room.building} • ${room.floor} этаж • ${room.seats} мест`;

        const equipment = document.createElement("div");
        equipment.className = "chip";
        equipment.textContent = room.equipment;

        const form = document.createElement("div");
        form.className = "booking-form";

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = todayStr();
        dateInput.min = todayStr();

        const startInput = document.createElement("input");
        startInput.type = "time";
        startInput.value = "09:00";
        startInput.step = "900";

        const endInput = document.createElement("input");
        endInput.type = "time";
        endInput.value = "10:30";
        endInput.step = "900";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Название (напр., Лекция)";
        titleInput.maxLength = 60;

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Забронировать";
        submitBtn.addEventListener("click", () => {
            const ok = addBooking(
                room.id,
                dateInput.value,
                startInput.value,
                endInput.value,
                titleInput.value.trim()
            );
            if (ok) navigate("bookings");
        });

        form.append(dateInput, startInput, endInput, titleInput, submitBtn);
        card.append(icon, name, meta, equipment, form);
        grid.append(card);
    });

    wrap.append(grid);
    return wrap;
}

// РЕНДЕР: БРОНИРОВАНИЯ
function renderBookings() {
    const wrap = document.createElement("div");
    wrap.className = "fade-in";

    if (bookings.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";

        const icon = document.createElement("span");
        icon.className = "icon";
        icon.textContent = "📭";

        const text = document.createElement("span");
        text.textContent = "Пока нет бронирований. Перейдите во вкладку «Аудитории».";

        empty.append(icon, text);
        wrap.append(empty);
        return wrap;
    }

    const sorted = [...bookings].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return timeToMinutes(a.start) - timeToMinutes(b.start);
    });

    const list = document.createElement("div");
    list.className = "booking-list";

    sorted.forEach(b => {
        const room = data.rooms.find(r => r.id === b.roomId);
        const item = document.createElement("div");
        item.className = "booking-item";

        const icon = document.createElement("div");
        icon.className = "icon";
        icon.textContent = room ? room.icon : "🏫";

        const info = document.createElement("div");
        info.className = "info";

        const title = document.createElement("h4");
        title.textContent = b.title;

        const sub = document.createElement("span");
        sub.textContent = (room ? room.name + " • " + room.building : "Аудитория удалена") +
                          " • " + b.date;

        info.append(title, sub);

        const time = document.createElement("div");
        time.className = "time";
        time.textContent = `${b.start} – ${b.end}`;

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Отменить";
        cancelBtn.addEventListener("click", () => cancelBooking(b.id));

        item.append(icon, info, time, cancelBtn);
        list.append(item);
    });

    wrap.append(list);
    return wrap;
}

// РЕНДЕР: ПРАВИЛА
function renderRules() {
    const wrap = document.createElement("div");
    wrap.className = "rules fade-in";

    const title = document.createElement("h2");
    title.textContent = data.rules.title;
    wrap.append(title);

    const ol = document.createElement("ol");
    data.rules.list.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        ol.append(li);
    });
    wrap.append(ol);

    const note = document.createElement("div");
    note.className = "note";
    note.textContent = data.rules.note;
    wrap.append(note);

    return wrap;
}

// КАРТА СТРАНИЦ И НАВИГАЦИЯ
const pages = {
    rooms:    renderRooms,
    bookings: renderBookings,
    rules:    renderRules
};

function navigate(pageKey) {
    const render = pages[pageKey];
    if (!render) return;

    content.replaceChildren(render());

    tabs.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.page === pageKey);
    });

    document.title = "Бронирование аудиторий — " + pageKey;
}

// СОБЫТИЯ ВКЛАДОК

tabs.forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
});

// ИНИЦИАЛИЗАЦИЯ
setupKeyboardNavigation();
updateBookBadge();
navigate("rooms");
focusFirstTab();