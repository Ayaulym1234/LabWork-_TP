// 1. Импортируем функции из всех модулей
import { roomsList } from './rooms.js';
import { canBook, isTimeValid } from './validation.js';
import { addBooking, getBookings, clearAllBookings } from './booking.js';
import { renderRoomsSelect, renderBookingsList, showMessage } from './ui.js';

// Ждем загрузки HTML
document.addEventListener('DOMContentLoaded', () => {
    
    // Находим элементы
    const roomSelect = document.getElementById('room-select');
    const startInput = document.getElementById('start-time');
    const endInput = document.getElementById('end-time');
    const bookBtn = document.getElementById('book-btn');
    const clearBtn = document.getElementById('clear-btn');
    const msgEl = document.getElementById('message');
    const listEl = document.getElementById('bookings-list');

    // Заполняем выпадающий список комнат
    renderRoomsSelect(roomsList, roomSelect);

    // Отрисовка (вызывается после каждого изменения)
    function updateUI() {
        renderBookingsList(getBookings(), listEl);
    }

    // Обработка клика "Забронировать"
    bookBtn.addEventListener('click', () => {
        const roomId = Number(roomSelect.value);
        const roomName = roomSelect.options[roomSelect.selectedIndex].text;
        const startTime = startInput.value;
        const endTime = endInput.value;

        // Проверка 1: Время введено корректно?
        if (!isTimeValid(startTime, endTime)) {
            showMessage(msgEl, 'Ошибка: Проверьте время (конец должен быть позже начала)!', 'error');
            return;
        }

        // Проверка 2: Нет ли пересечений с другими бронями?
        const available = canBook(roomId, startTime, endTime, getBookings());
        
        if (!available) {
            showMessage(msgEl, 'Ошибка: Это время уже занято в выбранной аудитории!', 'error');
            return;
        }

        // Если всё хорошо — добавляем бронь
        addBooking(roomId, roomName, startTime, endTime);
        updateUI();
        showMessage(msgEl, 'Аудитория успешно забронирована!', 'success');

        // Очищаем поля
        startInput.value = '';
        endInput.value = '';
    });

    // Обработка клика "Очистить всё"
    clearBtn.addEventListener('click', () => {
        clearAllBookings();
        updateUI();
        showMessage(msgEl, '', ''); // Убираем сообщения
    });

    // Первичный запуск интерфейса
    updateUI();
});