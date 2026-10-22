const form = document.getElementById('orderForm');
const summary = document.getElementById('summary');

const fields = {
    fullName:    document.getElementById('fullName'),
    email:       document.getElementById('email'),
    phone:       document.getElementById('phone'),
    city:        document.getElementById('city'),
    address:     document.getElementById('address'),
    delivery:    document.getElementById('delivery'),
    payment:     document.getElementById('payment'),
    cardNumber:  document.getElementById('cardNumber'),
    agreeRules:  document.getElementById('agreeRules'),
    agreeData:   document.getElementById('agreeData')
};

const cardField   = document.getElementById('cardField');
const paymentEl   = document.getElementById('payment');

// Регулярные выражения
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{10,20}$/;
const CARD_REGEX  = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;

//  Подсветка корректных / ошибочных значений
function setValid(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
}

function setInvalid(input, errorTextEl, msg) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    if (errorTextEl) {
        errorTextEl.textContent = msg;
        errorTextEl.classList.add('show');
    }
}

function clearState(input, errorTextEl) {
    input.classList.remove('valid', 'invalid');
    if (errorTextEl) {
        errorTextEl.textContent = '';
        errorTextEl.classList.remove('show');
    }
}

// Получить DOM-элемент ошибки по имени поля
function getErrorEl(name) {
    return document.querySelector(`.error-text[data-for="${name}"]`);
}

// Правила валидации для каждого поля
// Возвращает { ok: true } или { ok: false, msg: '...' }=
const validators = {
    fullName: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите ФИО' };
        if (val.length < 5) return { ok: false, msg: 'Минимум 5 символов' };
        if (val.split(/\s+/).filter(w => w).length < 2) 
            return { ok: false, msg: 'Укажите фамилию и имя' };
        return { ok: true };
    },
    email: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите e-mail' };
        if (!EMAIL_REGEX.test(val)) return { ok: false, msg: 'Некорректный e-mail' };
        return { ok: true };
    },
    phone: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите телефон' };
        if (!PHONE_REGEX.test(val)) return { ok: false, msg: 'Некорректный телефон' };
        if (val.replace(/\D/g, '').length < 10) 
            return { ok: false, msg: 'Слишком мало цифр' };
        return { ok: true };
    },
    city: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите город' };
        if (val.length < 2) return { ok: false, msg: 'Слишком короткое название' };
        return { ok: true };
    },
    address: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите адрес' };
        if (val.length < 5) return { ok: false, msg: 'Адрес слишком короткий' };
        return { ok: true };
    },
    delivery: (v) => {
        if (v === '') return { ok: false, msg: 'Выберите способ доставки' };
        return { ok: true };
    },
    payment: (v) => {
        if (v === '') return { ok: false, msg: 'Выберите способ оплаты' };
        return { ok: true };
    },
    cardNumber: (v) => {
        const val = v.trim();
        if (val === '') return { ok: false, msg: 'Введите номер карты' };
        if (!CARD_REGEX.test(val)) 
            return { ok: false, msg: 'Формат: 0000 0000 0000 0000' };
        return { ok: true };
    },
    agreeRules: (v) => {
        if (!v) return { ok: false, msg: 'Подтвердите согласие с правилами' };
        return { ok: true };
    },
    agreeData: (v) => {
        if (!v) return { ok: false, msg: 'Подтвердите обработку данных' };
        return { ok: true };
    }
};

// ✅ Универсальная проверка одного поля
function validateField(name) {
    const input = fields[name];
    const errorEl = getErrorEl(name);
    if (!input) return true;

    const value = input.type === 'checkbox' ? input.checked : input.value;
    const result = validators[name](value);

    if (result.ok) {
        setValid(input);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
        return true;
    } else {
        setInvalid(input, errorEl, result.msg);
        return false;
    }
}

// ✅ Проверка всей формы
function validateForm() {
    let ok = true;
    let firstInvalid = null;

    for (const name in fields) {
        // Пропускаем карту, если оплата не картой
        if (name === 'cardNumber' && paymentEl.value !== 'card') continue;

        if (!validateField(name)) {
            ok = false;
            if (!firstInvalid) firstInvalid = fields[name];
        }
    }

    if (!ok && firstInvalid) firstInvalid.focus();
    return ok;
}

// События

// Ввод — проверяем поле в реальном времени, но не ругаемся на пустое
Object.keys(fields).forEach(name => {
    const input = fields[name];
    const evt = input.type === 'checkbox' ? 'change' : 'input';

    input.addEventListener(evt, () => {
        // Для пустого значения снимаем подсветку, но не показываем ошибку
        const value = input.type === 'checkbox' ? input.checked : input.value;
        if (input.type !== 'checkbox' && value.trim() === '') {
            clearState(input, getErrorEl(name));
            return;
        }
        if (input.type === 'checkbox' && !value) {
            clearState(input, getErrorEl(name));
            return;
        }
        validateField(name);
    });

    // blur — показать ошибку, если поле покинули пустым
    if (input.type !== 'checkbox') {
        input.addEventListener('blur', () => {
            validateField(name);
        });
    }
});

// Показ/скрытие поля номера карты
paymentEl.addEventListener('change', () => {
    if (paymentEl.value === 'card') {
        cardField.style.display = 'block';
    } else {
        cardField.style.display = 'none';
        clearState(fields.cardNumber, getErrorEl('cardNumber'));
        fields.cardNumber.value = '';
    }
    validateField('payment');
});

// Автоформат номера карты: 0000 0000 0000 0000
fields.cardNumber.addEventListener('input', (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formatted;
});

// Отправка формы
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (validateForm()) {
        summary.className = 'success';
        summary.textContent = '✅ Заказ оформлен! Мы свяжемся с вами в ближайшее время.';
        console.log('Отправка заказа:', {
            fullName:   fields.fullName.value.trim(),
            email:      fields.email.value.trim(),
            phone:      fields.phone.value.trim(),
            city:       fields.city.value.trim(),
            address:    fields.address.value.trim(),
            delivery:   fields.delivery.value,
            payment:    fields.payment.value,
            card:       paymentEl.value === 'card' ? fields.cardNumber.value : null,
            agreeRules: fields.agreeRules.checked,
            agreeData:  fields.agreeData.checked
        });
    } else {
        summary.className = 'error';
        summary.textContent = '❌ Исправьте ошибки в выделенных полях';
    }
});