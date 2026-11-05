// Проверяет, пересекаются ли два временных промежутка
export function isOverlap(start1, end1, start2, end2) {
    // Формула пересечения: (Начало1 < Конец2) И (Конец1 > Начало2)
    return (start1 < end2) && (end1 > start2);
}

// Проверяет, можно ли забронировать время (ищет конфликты в существующих бронях)
export function canBook(roomId, startTime, endTime, allBookings) {
    for (let i = 0; i < allBookings.length; i++) {
        const b = allBookings[i];
        
        // Если это та же аудитория и время пересекается — возвращаем false
        if (b.roomId === roomId && isOverlap(startTime, endTime, b.startTime, b.endTime)) {
            return false; 
        }
    }
    return true; // Конфликтов нет
}

// Проверяет, что время введено верно (конец позже начала)
export function isTimeValid(startTime, endTime) {
    if (!startTime || !endTime) return false;
    return startTime < endTime;
}