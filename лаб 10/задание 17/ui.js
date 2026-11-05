// Заполнить выпадающий список аудиторий
export function renderRoomsSelect(rooms, selectEl) {
    selectEl.innerHTML = '';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        selectEl.appendChild(option);
    });
}

// Показать список броней на экране
export function renderBookingsList(bookings, listEl) {
    listEl.innerHTML = '';
    bookings.forEach(b => {
        const li = document.createElement('li');
        // Выводим: Аудитория 101 (10:00 - 12:00)
        li.textContent = `${b.roomName} [${b.startTime} – ${b.endTime}]`;
        listEl.appendChild(li);
    });
}

// Показать сообщение (успех или ошибку)
export function showMessage(msgEl, text, type) {
    msgEl.textContent = text;
    msgEl.className = 'msg ' + type; // type = 'success' или 'error'
}