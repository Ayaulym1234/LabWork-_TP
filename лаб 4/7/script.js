// Ссылки на элементы формы
const form = document.getElementById('registerForm');
const loginInput = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const messageEl = document.getElementById('message');

// Регулярное выражение для e-mail
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Минимальная длина пароля
const MIN_PASSWORD_LENGTH = 8;

// Функция вывода сообщения
function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + (isError ? 'error' : 'success');
}

// Сброс сообщения
function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Обработчик отправки формы
form.addEventListener('submit', function (event) {
    // 5. Отменяем стандартную отправку формы
    event.preventDefault();
    clearMessage();

    // Считываем значения полей
    const login = loginInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    // 6. Проверки полей с понятными сообщениями

    // Логин
    if (login === '') {
        showMessage('Введите логин');
        loginInput.focus();
        return;
    }
    if (login.length < 3) {
        showMessage('Логин должен содержать минимум 3 символа');
        loginInput.focus();
        return;
    }
    if (/\s/.test(login)) {
        showMessage('Логин не должен содержать пробелов');
        loginInput.focus();
        return;
    }

    // E-mail
    if (email === '') {
        showMessage('Введите e-mail');
        emailInput.focus();
        return;
    }
    if (!EMAIL_REGEX.test(email)) {
        showMessage('Введите корректный e-mail (пример: user@example.com)');
        emailInput.focus();
        return;
    }

    // Пароль
    if (password === '') {
        showMessage('Введите пароль');
        passwordInput.focus();
        return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        showMessage(`Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`);
        passwordInput.focus();
        return;
    }

    // Повтор пароля
    if (confirm === '') {
        showMessage('Повторите пароль');
        confirmInput.focus();
        return;
    }
    if (password !== confirm) {
        showMessage('Пароли не совпадают');
        confirmInput.focus();
        return;
    }

    // 7. Все проверки пройдены — выводим итоговые данные
    showMessage(
        `Регистрация успешна!\nЛогин: ${login}\nE-mail: ${email}\nПароль: ${'*'.repeat(password.length)}`,
        false
    );

    // (по желанию) можно очистить форму:
    // form.reset();
});

// Очищаем сообщение при вводе в любое поле
[loginInput, emailInput, passwordInput, confirmInput].forEach(function (el) {
    el.addEventListener('input', clearMessage);
});