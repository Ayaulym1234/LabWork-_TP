const form    = document.getElementById('studentForm');
const nameEl  = document.getElementById('fullName');
const emailEl = document.getElementById('email');
const courseEl = document.getElementById('course');
const agreeEl = document.getElementById('agree');
const message = document.getElementById('message');

const nameCounterEl  = document.getElementById('nameCounter');
const emailCounterEl = document.getElementById('emailCounter');

const NAME_MAX  = 50;
const EMAIL_MAX = 60;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// ✅ НОВАЯ ФУНКЦИЯ: обновление счётчика символов
// ============================================================
function updateCounter(inputEl, counterEl, max) {
    const len = inputEl.value.length;
    counterEl.textContent = `${len} / ${max}`;

    // Сбрасываем предыдущие классы
    counterEl.classList.remove('ok', 'warning', 'too-long');

    // Логика цветовой индикации:
    // < 80% — нейтрально, 80–100% — предупреждение, > 100% — перебор
    const ratio = len / max;
    if (len === 0) {
        // пусто — нейтральный серый
    } else if (ratio >= 1) {
        counterEl.classList.add('too-long');
    } else if (ratio >= 0.8) {
        counterEl.classList.add('warning');
    } else {
        counterEl.classList.add('ok');
    }

    // Дополнительно подсвечиваем поле рамкой, если перебор
    if (len > max) {
        inputEl.classList.add('invalid');
    } else {
        inputEl.classList.remove('invalid');
    }
}

function resetStyles() {
    [nameEl, emailEl, courseEl].forEach(el => {
        el.classList.remove('invalid', 'valid');
    });
}

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

function isValidName(name) {
    const words = name.split(/\s+/).filter(w => w.length > 0);
    return name.length >= 5 && words.length >= 2;
}

function validateForm() {
    resetStyles();

    const name   = nameEl.value.trim();
    const email  = emailEl.value.trim();
    const course = courseEl.value;
    const agree  = agreeEl.checked;

    if (name === '') {
        markInvalid(nameEl);
        showMessage('❌ Введите ФИО', 'error');
        nameEl.focus();
        return false;
    }
    if (!isValidName(name)) {
        markInvalid(nameEl);
        showMessage('❌ ФИО должно содержать минимум два слова и 5+ символов', 'error');
        nameEl.focus();
        return false;
    }
    if (name.length > NAME_MAX) {
        markInvalid(nameEl);
        showMessage(`❌ ФИО слишком длинное (макс. ${NAME_MAX} символов)`, 'error');
        nameEl.focus();
        return false;
    }
    markValid(nameEl);

    if (email === '') {
        markInvalid(emailEl);
        showMessage('❌ Введите e-mail', 'error');
        emailEl.focus();
        return false;
    }
    if (!EMAIL_REGEX.test(email)) {
        markInvalid(emailEl);
        showMessage('❌ Некорректный e-mail (пример: student@example.com)', 'error');
        emailEl.focus();
        return false;
    }
    if (email.length > EMAIL_MAX) {
        markInvalid(emailEl);
        showMessage(`❌ E-mail слишком длинный (макс. ${EMAIL_MAX} символов)`, 'error');
        emailEl.focus();
        return false;
    }
    markValid(emailEl);

    if (course === '') {
        markInvalid(courseEl);
        showMessage('❌ Выберите курс', 'error');
        courseEl.focus();
        return false;
    }
    markValid(courseEl);

    if (!agree) {
        showMessage('❌ Подтвердите согласие с правилами', 'error');
        return false;
    }

    showMessage(`✅ Студент «${name}» успешно зарегистрирован на ${course} курс!`, 'success');
    return true;
}

// ============================================================
// ✅ События: счётчик обновляется при каждом вводе
// ============================================================

nameEl.addEventListener('input', function () {
    updateCounter(nameEl, nameCounterEl, NAME_MAX);
    if (nameEl.value.trim() !== '') {
        nameEl.classList.remove('invalid');
        if (message.classList.contains('error')) {
            showMessage('Заполните все обязательные поля', '');
        }
    }
});

emailEl.addEventListener('input', function () {
    updateCounter(emailEl, emailCounterEl, EMAIL_MAX);
    if (emailEl.value.trim() !== '') {
        emailEl.classList.remove('invalid');
        if (message.classList.contains('error')) {
            showMessage('Заполните все обязательные поля', '');
        }
    }
});

courseEl.addEventListener('change', function () {
    if (courseEl.value !== '') {
        courseEl.classList.remove('invalid');
        if (message.classList.contains('error')) {
            showMessage('Заполните все обязательные поля', '');
        }
    }
});

agreeEl.addEventListener('change', function () {
    if (agreeEl.checked && message.classList.contains('error')) {
        showMessage('Заполните все обязательные поля', '');
    }
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm()) {
        const data = {
            fullName: nameEl.value.trim(),
            email:    emailEl.value.trim(),
            course:   courseEl.value,
            agree:    agreeEl.checked
        };
        console.log('Данные формы:', data);
    }
});