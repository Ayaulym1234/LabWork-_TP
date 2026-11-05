// 1. Импортируем функции из модулей
import { calcStudentAverage, calcClassAverage } from './module/grade.js';
import { saveToStorage, loadFromStorage, clearStorage } from './module/storage.js';

// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', () => {

    // Находим элементы
    const nameInput = document.getElementById('name-input');
    const gradeInput = document.getElementById('grade-input');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorMsg = document.getElementById('error-msg');
    const list = document.getElementById('students-list');
    const classAvgSpan = document.getElementById('class-average');

    // Загружаем данные из хранилища при старте
    let students = loadFromStorage();

    // Функция обновления экрана
    function updateUI() {
        list.innerHTML = ''; // Очищаем список
        
        // Рисуем каждого студента
        students.forEach(student => {
            const avg = calcStudentAverage(student.grades).toFixed(2);
            const li = document.createElement('li');
            li.textContent = `${student.name} — Оценки: [${student.grades.join(', ')}] | Средний: ${avg}`;
            list.appendChild(li);
        });

        // Считаем и показываем средний балл группы
        const classAvg = calcClassAverage(students).toFixed(2);
        classAvgSpan.textContent = classAvg;
    }

    // Обработка добавления студента
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const grade = Number(gradeInput.value);

        errorMsg.textContent = ''; // Сбрасываем ошибки

        // Проверки (Валидация)
        if (name === '') {
            errorMsg.textContent = 'Введите имя!';
            return;
        }
        if (isNaN(grade) || grade < 1 || grade > 5) {
            errorMsg.textContent = 'Оценка должна быть от 1 до 5!';
            return;
        }

        // Ищем, есть ли уже такой студент
        const existingStudent = students.find(s => s.name === name);

        if (existingStudent) {
            // Если есть — просто добавляем оценку
            existingStudent.grades.push(grade);
        } else {
            // Если нет — создаем нового
            students.push({ name: name, grades: [grade] });
        }

        // Сохраняем и обновляем экран
        saveToStorage(students);
        updateUI();

        // Очищаем поля ввода
        nameInput.value = '';
        gradeInput.value = '';
    });

    // Обработка очистки
    clearBtn.addEventListener('click', () => {
        students = [];
        clearStorage();
        updateUI();
    });

    // Первый запуск интерфейса
    updateUI();
});