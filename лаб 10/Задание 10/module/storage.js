// Сохраняет массив студентов в localStorage (превращая в текст)
export function saveToStorage(students) {
    const jsonString = JSON.stringify(students);
    localStorage.setItem('myGradesData', jsonString);
}

// Загружает данные из localStorage (превращая текст обратно в массив)
export function loadFromStorage() {
    const jsonString = localStorage.getItem('myGradesData');
    if (!jsonString) return []; // Если пусто, возвращаем пустой массив
    
    return JSON.parse(jsonString);
}

// Очищает хранилище
export function clearStorage() {
    localStorage.removeItem('myGradesData');
}