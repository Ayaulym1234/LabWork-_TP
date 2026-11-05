// Внутренний массив броней
let bookings = [];

// Добавить новую бронь
export function addBooking(roomId, roomName, startTime, endTime) {
    bookings.push({
        roomId: roomId,
        roomName: roomName,
        startTime: startTime,
        endTime: endTime
    });
}

// Получить все брони
export function getBookings() {
    return bookings;
}

// Очистить все брони
export function clearAllBookings() {
    bookings = [];
}