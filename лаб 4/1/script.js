
const form = document.getElementById('studentForm');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const courseSelect = document.getElementById('course');
const agreeCheckbox = document.getElementById('agree');
const messageEl = document.getElementById('message');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + (isError ? 'error' : 'success');
}


function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
}


form.addEventListener('submit', function (event) {
    // 5. Отменяем стандартную отправку формы
    event.preventDefault();
    clearMessage();

    // Считываем значения полей
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const course = courseSelect.value;
    const agree = agreeCheckbox.checked;

    // 6. Проверки полей с понятными сообщениями

    // Проверка ФИО
    if (fullname === '') {
        showMessage('Введите ФИО');
        fullnameInput.focus();
        return;
    }
    if (fullname.length < 3) {
        showMessage('ФИО должно содержать минимум 3 символа');
        fullnameInput.focus();
        return;
    }
    // Проверка, что ФИО состоит минимум из двух слов (имя и фамилия)
    if (fullname.split(/\s+/).length < 2) {
        showMessage('Введите имя и фамилию');
        fullnameInput.focus();
        return;
    }

    // Проверка e-mail
    if (email === '') {
        showMessage('Введите e-mail');
        emailInput.focus();
        return;
    }
    if (!EMAIL_REGEX.test(email)) {
        showMessage('Введите корректный e-mail (пример: student@example.com)');
        emailInput.focus();
        return;
    }

    // Проверка курса
    if (course === '') {
        showMessage('Выберите курс');
        courseSelect.focus();
        return;
    }

    // Проверка согласия с правилами
    if (!agree) {
        showMessage('Подтвердите согласие с правилами');
        agreeCheckbox.focus();
        return;
    }

    // 7. Все проверки пройдены — выводим итоговые данные
    showMessage(
        `Форма заполнена корректно!\nФИО: ${fullname}\nE-mail: ${email}\nКурс: ${course}`,
        false
    );

    // (по желанию) можно очистить форму после успешной проверки:
    // form.reset();
});

// Необязательно: очищаем сообщение при вводе в любое поле
[fullnameInput, emailInput, courseSelect, agreeCheckbox].forEach(function (el) {
    el.addEventListener('input', clearMessage);
    el.addEventListener('change', clearMessage);
});