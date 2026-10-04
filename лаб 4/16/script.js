// ===== Ссылки на форму и элементы =====
const form = document.getElementById('orderForm');
const messageEl = document.getElementById('message');

const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const cityInput = document.getElementById('city');
const addressInput = document.getElementById('address');
const deliverySelect = document.getElementById('delivery');

const cardFields = document.getElementById('cardFields');
const cardInput = document.getElementById('card');

const agreeTerms = document.getElementById('agreeTerms');
const agreeData = document.getElementById('agreeData');

// ===== Регулярные выражения =====
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{10,18}$/;
const CARD_REGEX  = /^\d{16}$/;

// ===== Утилиты для сообщений об ошибках рядом с полями =====
function setError(fieldId, text) {
    const span = document.querySelector(`.error[data-error-for="${fieldId}"]`);
    if (span) span.textContent = text;

    // Подсветка поля
    const el = document.getElementById(fieldId);
    if (el) el.classList.add('invalid');

    // Для radio-группы поле подсвечивать не нужно
    if (fieldId === 'payment') {
        document.querySelectorAll('input[name="payment"]').forEach(r =>
            r.closest('.radio-group').classList.add('invalid-group'));
    }
}

function clearError(fieldId) {
    const span = document.querySelector(`.error[data-error-for="${fieldId}"]`);
    if (span) span.textContent = '';

    const el = document.getElementById(fieldId);
    if (el) el.classList.remove('invalid');

    if (fieldId === 'payment') {
        document.querySelectorAll('input[name="payment"]').forEach(r =>
            r.closest('.radio-group').classList.remove('invalid-group'));
    }
}

function clearAllErrors() {
    ['fullname', 'email', 'phone', 'city', 'address',
     'delivery', 'payment', 'card', 'agreeTerms', 'agreeData']
        .forEach(clearError);
    messageEl.textContent = '';
    messageEl.className = 'message';
}

function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.className = 'message ' + (isError ? 'error' : 'success');
}

// ===== Показ блока с номером карты =====
function toggleCardField() {
    const payment = form.querySelector('input[name="payment"]:checked');
    if (payment && payment.value === 'card') {
        cardFields.hidden = false;
    } else {
        cardFields.hidden = true;
        cardInput.value = '';
        clearError('card');
    }
}

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
        clearError('payment');
        toggleCardField();
    });
});

// ===== Валидация отдельных полей (для повторного использования) =====
function validateFullname() {
    const v = fullnameInput.value.trim();
    if (v === '')                 { setError('fullname', 'Введите ФИО'); return false; }
    if (v.split(/\s+/).length < 2){ setError('fullname', 'Введите имя и фамилию'); return false; }
    clearError('fullname'); return true;
}

function validateEmail() {
    const v = emailInput.value.trim();
    if (v === '')                    { setError('email', 'Введите e-mail'); return false; }
    if (!EMAIL_REGEX.test(v))        { setError('email', 'Некорректный e-mail'); return false; }
    clearError('email'); return true;
}

function validatePhone() {
    const v = phoneInput.value.trim();
    if (v === '')                    { setError('phone', 'Введите телефон'); return false; }
    if (!PHONE_REGEX.test(v))        { setError('phone', 'Некорректный номер телефона'); return false; }
    clearError('phone'); return true;
}

function validateCity() {
    const v = cityInput.value.trim();
    if (v === '')                    { setError('city', 'Укажите город'); return false; }
    clearError('city'); return true;
}

function validateAddress() {
    const v = addressInput.value.trim();
    if (v === '')                    { setError('address', 'Укажите адрес доставки'); return false; }
    if (v.length < 5)                { setError('address', 'Адрес слишком короткий'); return false; }
    clearError('address'); return true;
}

function validateDelivery() {
    const v = deliverySelect.value;
    if (v === '')                    { setError('delivery', 'Выберите способ доставки'); return false; }
    clearError('delivery'); return true;
}

function validatePayment() {
    const checked = form.querySelector('input[name="payment"]:checked');
    if (!checked)                    { setError('payment', 'Выберите способ оплаты'); return false; }
    clearError('payment'); return true;
}

function validateCard() {
    const payment = form.querySelector('input[name="payment"]:checked');
    if (!payment || payment.value !== 'card') {
        clearError('card');
        return true; // поле не обязательно, если оплата не картой
    }
    const digits = cardInput.value.replace(/\s+/g, '');
    if (digits === '')               { setError('card', 'Введите номер карты'); return false; }
    if (!CARD_REGEX.test(digits))    { setError('card', 'Номер карты должен содержать 16 цифр'); return false; }
    clearError('card'); return true;
}

function validateAgreeTerms() {
    if (!agreeTerms.checked)         { setError('agreeTerms', 'Необходимо принять условия оферты'); return false; }
    clearError('agreeTerms'); return true;
}

function validateAgreeData() {
    if (!agreeData.checked)          { setError('agreeData', 'Необходимо согласие на обработку данных'); return false; }
    clearError('agreeData'); return true;
}

// ===== Валидация "на лету" =====
fullnameInput.addEventListener('input', validateFullname);
emailInput   .addEventListener('input', validateEmail);
phoneInput   .addEventListener('input', validatePhone);
cityInput    .addEventListener('input', validateCity);
addressInput .addEventListener('input', validateAddress);
deliverySelect.addEventListener('change', validateDelivery);
cardInput    .addEventListener('input', validateCard);
agreeTerms   .addEventListener('change', validateAgreeTerms);
agreeData    .addEventListener('change', validateAgreeData);

// ===== Обработка submit =====
form.addEventListener('submit', function (event) {
    // 5. Отменяем стандартную отправку формы
    event.preventDefault();
    clearAllErrors();

    // 6. Запускаем все проверки, собираем результат
    const checks = [
        validateFullname(),
        validateEmail(),
        validatePhone(),
        validateCity(),
        validateAddress(),
        validateDelivery(),
        validatePayment(),
        validateCard(),
        validateAgreeTerms(),
        validateAgreeData()
    ];

    const isValid = checks.every(Boolean);

    if (!isValid) {
        showMessage('Пожалуйста, исправьте ошибки в форме');
        // Переводим фокус на первое невалидное поле
        const firstInvalid = form.querySelector('.invalid, input:invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // 7. Итоговые данные
    const payment = form.querySelector('input[name="payment"]:checked').value;
    const paymentLabels = { card: 'Картой онлайн', cash: 'Наличными', sbp: 'СБП' };

    const data = [
        `ФИО: ${fullnameInput.value.trim()}`,
        `E-mail: ${emailInput.value.trim()}`,
        `Телефон: ${phoneInput.value.trim()}`,
        `Город: ${cityInput.value.trim()}`,
        `Адрес: ${addressInput.value.trim()}`,
        `Доставка: ${deliverySelect.options[deliverySelect.selectedIndex].text}`,
        `Оплата: ${paymentLabels[payment]}`,
        payment === 'card'
            ? `Карта: **** **** **** ${cardInput.value.replace(/\s+/g, '').slice(-4)}`
            : null
    ].filter(Boolean).join('\n');

    showMessage('Заказ успешно оформлен!\n\n' + data, false);
    form.reset();
    cardFields.hidden = true;
});