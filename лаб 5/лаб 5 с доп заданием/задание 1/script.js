const ageInput = document.getElementById('ageInput');
const checkBtn = document.getElementById('checkBtn');
const result   = document.getElementById('result');

function getCategory(age) {
    if (age < 0 || age > 120 || isNaN(age)) {
        return 'error';
    } else if (age < 7) {
        return 'child';
    } else if (age < 18) {
        return 'teen';
    } else if (age < 65) {
        return 'adult';
    } else {
        return 'senior';
    }
}

const messages = {
    child:  '👶 Ребёнок (дошкольник)',
    teen:   '🧑 Подросток',
    adult:  '🧑‍💼 Взрослый',
    senior: '👴 Пожилой человек',
    error:  '❌ Некорректный возраст. Введите число от 0 до 120.'
};

function getRecommendation(category) {
    const tips = {
        child:  '👨‍👩‍👧 Вам доступны детские секции и садик. Онлайн-покупки — только с родителями.',
        teen:   '📚 Доступны подростковые курсы и лагеря. Паспорт можно получить с 16 лет.',
        adult:  '💼 Полный доступ к работе, кредитам и вождению. Не забудьте про налоговый вычет!',
        senior: '🎁 Вам положены пенсионные льготы и скидки на лекарства. Проверьте соцпакет.',
        error:  ''
    };
    return tips[category] || '';
}

function showResult(category) {
    result.className = '';
    result.classList.add(category);
    result.textContent = messages[category];

    const rec = getRecommendation(category);
    if (rec) {
        const tipEl = document.createElement('div');
        tipEl.className = 'tip';
        tipEl.textContent = rec;
        result.appendChild(tipEl);
    }
}

function checkAge() {
    const age = Number(ageInput.value);
    const category = getCategory(age);

    for (let i = 0; i < 1; i++) {
        ageInput.style.borderColor = category === 'error' ? '#dc3545' : '#28a745';
    }

    showResult(category);
}

checkBtn.addEventListener('click', checkAge);

ageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkAge();
    }
});

ageInput.addEventListener('input', () => {
    ageInput.style.borderColor = '#ccc';
    result.className = '';
    result.textContent = 'Здесь появится результат...';
});