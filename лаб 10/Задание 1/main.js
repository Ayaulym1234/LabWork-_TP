// Ждем, пока страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    
    // Находим элементы
    const input = document.getElementById('celsius-input');
    const button = document.getElementById('convert-btn');
    const resultBox = document.getElementById('result');

    // Функция конвертации
    button.addEventListener('click', function() {
        const celsius = parseFloat(input.value);

        // Очищаем старые стили
        resultBox.className = '';

        // Проверка 1: пустое поле или буквы
        if (isNaN(celsius)) {
            resultBox.classList.add('error');
            resultBox.textContent = 'Ошибка: Введите число!';
            return;
        }

        // Проверка 2: температура ниже абсолютного нуля
        if (!window.TemperatureMath.isValidCelsius(celsius)) {
            resultBox.classList.add('error');
            resultBox.textContent = 'Ошибка: Ниже -273.15 C не бывает!';
            return;
        }

        // Считаем
        const f = window.TemperatureMath.celsiusToFahrenheit(celsius).toFixed(1);
        const k = window.TemperatureMath.celsiusToKelvin(celsius).toFixed(1);

        // Показываем результат
        resultBox.classList.add('success');
        resultBox.textContent = `${celsius} C = ${f} F = ${k} K`;
    });
});