const form          = document.getElementById('registerForm');
const loginEl       = document.getElementById('login');
const emailEl       = document.getElementById('email');
const passwordEl    = document.getElementById('password');
const confirmEl     = document.getElementById('passwordConfirm');
const message       = document.getElementById('message');

const loginCounterEl    = document.getElementById('loginCounter');
const emailCounterEl    = document.getElementById('emailCounter');
const passwordCounterEl = document.getElementById('passwordCounter');
const strengthFill      = document.getElementById('strengthFill');
const strengthText      = document.getElementById('strengthText');
const matchHint         = document.getElementById('matchHint');

const LOGIN_MAX    = 20;
const EMAIL_MAX    = 60;
const PASSWORD_MAX = 32;
const PASSWORD_MIN = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

//  Счётчик символов с цветовой индикацией
function updateCounter(inputEl, counterEl, max, min) {
    const len = inputEl.value.length;
    counterEl.textContent = `${len} / ${max}`;

    counterEl.classList.remove('ok', 'warning', 'too-long', 'too-short');

    if (len === 0) return;

    if (len > max) {
        counterEl.classList.add('too-long');
    } else if (min !== undefined && len < min) {
        counterEl.classList.add('too-short');
    } else if (len / max >= 0.8) {
        counterEl.classList.add('warning');
    } else {
        counterEl.classList.add('ok');
    }
}

//  Оценка силы пароля (дополнительная функция)
function getPasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8)  score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd))   score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const levels = [
        { width: '0%',   color: '#eee',    text: '' },
        { width: '20%',  color: '#e74c3c', text: 'Очень слабый' },
        { width: '40%',  color: '#e67e22', text: 'Слабый' },
        { width: '60%',  color: '#f1c40f', text: 'Средний' },
        { width: '80%',  color: '#2ecc71', text: 'Хороший' },
        { width: '100%', color: '#27ae60', text: 'Сильный' }
    ];
    return levels[Math.min(score, 5)];
}

function updateStrength() {
    const pwd = passwordEl.value;
    const level = getPasswordStrength(pwd);
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = level.text;
    strengthText.style.color = level.color;
}

//  Проверка совпадения паролей в реальном времени
function updateMatch() {
    const pwd = passwordEl.value;
    const confirm = confirmEl.value;

    if (confirm === '') {
        matchHint.textContent = '';
        matchHint.className = 'match-hint';
        confirmEl.classList.remove('valid', 'invalid');
        return;
    }

    if (pwd === confirm) {
        matchHint.textContent = '✅ Пароли совпадают';
        matchHint.className = 'match-hint ok';
        confirmEl.classList.add('valid');
        confirmEl.classList.remove('invalid');
    } else {
        matchHint.textContent = '❌ Пароли не совпадают';
        matchHint.className = 'match-hint error';
        confirmEl.classList.add('invalid');
        confirmEl.classList.remove('valid');
    }
}

// Валидация полей
function markInvalid(el) {
    el.classList.remove('valid');
    el.classList.add('invalid');
}

function markValid(el) {
    el.classList.remove('invalid');
    el.classList.add('valid');
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type || '';
}

function validateForm() {
    [loginEl, emailEl, passwordEl, confirmEl].forEach(el => {
        el.classList.remove('invalid', 'valid');
    });

    const login   = loginEl.value.trim();
    const email   = emailEl.value.trim();
    const pwd     = passwordEl.value;
    const confirm = confirmEl.value;

    if (login === '') {
        markInvalid(loginEl);
        showMessage('❌ Введите логин', 'error');
        loginEl.focus();
        return false;
    }
    if (!LOGIN_REGEX.test(login)) {
        markInvalid(loginEl);
        showMessage('❌ Логин: 3–20 символов, только латиница, цифры и _', 'error');
        loginEl.focus();
        return false;
    }
    markValid(loginEl);

    if (email === '') {
        markInvalid(emailEl);
        showMessage('❌ Введите e-mail', 'error');
        emailEl.focus();
        return false;
    }
    if (!EMAIL_REGEX.test(email)) {
        markInvalid(emailEl);
        showMessage('❌ Некорректный e-mail (пример: user@example.com)', 'error');
        emailEl.focus();
        return false;
    }
    markValid(emailEl);

    if (pwd === '') {
        markInvalid(passwordEl);
        showMessage('❌ Введите пароль', 'error');
        passwordEl.focus();
        return false;
    }
    if (pwd.length < PASSWORD_MIN) {
        markInvalid(passwordEl);
        showMessage(`❌ Пароль должен содержать минимум ${PASSWORD_MIN} символов`, 'error');
        passwordEl.focus();
        return false;
    }
    markValid(passwordEl);

    if (confirm === '') {
        markInvalid(confirmEl);
        showMessage('❌ Повторите пароль', 'error');
        confirmEl.focus();
        return false;
    }
    if (pwd !== confirm) {
        markInvalid(confirmEl);
        showMessage('❌ Пароли не совпадают', 'error');
        confirmEl.focus();
        return false;
    }
    markValid(confirmEl);

    showMessage(`✅ Аккаунт «${login}» успешно зарегистрирован!`, 'success');
    return true;
}

// События

loginEl.addEventListener('input', () => {
    updateCounter(loginEl, loginCounterEl, LOGIN_MAX, 3);
    loginEl.classList.remove('invalid');
});

emailEl.addEventListener('input', () => {
    updateCounter(emailEl, emailCounterEl, EMAIL_MAX);
    emailEl.classList.remove('invalid');
});

passwordEl.addEventListener('input', () => {
    updateCounter(passwordEl, passwordCounterEl, PASSWORD_MAX, PASSWORD_MIN);
    updateStrength();
    updateMatch();
});

confirmEl.addEventListener('input', updateMatch);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
        console.log('Регистрация:', {
            login: loginEl.value.trim(),
            email: emailEl.value.trim(),
            passwordLength: passwordEl.value.length
        });
    }
});