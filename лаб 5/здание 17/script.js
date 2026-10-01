const products = [
    { id: 1,  name: 'Смартфон Galaxy S23',   category: 'Электроника', price: 399990, rating: 4.8, emoji: '📱' },
    { id: 2,  name: 'Ноутбук MacBook Air',   category: 'Электроника', price: 599990, rating: 4.9, emoji: '💻' },
    { id: 3,  name: 'Наушники Sony WH-1000', category: 'Аудио',       price: 149990, rating: 4.7, emoji: '🎧' },
    { id: 4,  name: 'Клавиатура Logitech',   category: 'Аксессуары',  price: 22990,  rating: 4.5, emoji: '⌨️' },
    { id: 5,  name: 'Мышь Razer DeathAdder', category: 'Аксессуары',  price: 34990,  rating: 4.6, emoji: '🖱️' },
    { id: 6,  name: 'Монитор Dell 27"',      category: 'Электроника', price: 174990, rating: 4.4, emoji: '🖥️' },
    { id: 7,  name: 'Планшет iPad Pro',      category: 'Электроника', price: 449990, rating: 4.9, emoji: '📲' },
    { id: 8,  name: 'Колонка JBL Flip 6',    category: 'Аудио',       price: 49990,  rating: 4.3, emoji: '🔊' },
    { id: 9,  name: 'Веб-камера Logitech',   category: 'Аксессуары',  price: 37490,  rating: 4.2, emoji: '📷' },
    { id: 10, name: 'Умные часы Apple',      category: 'Гаджеты',     price: 224990, rating: 4.8, emoji: '⌚' }
];

const catalogEl  = document.getElementById('catalog');
const statsEl    = document.getElementById('stats');
const maxPriceEl = document.getElementById('maxPrice');
const rangeEl    = document.getElementById('priceRange');
const resetBtn   = document.getElementById('resetBtn');

const MAX_LIMIT = Math.max(...products.map(p => p.price));
rangeEl.max = MAX_LIMIT;
rangeEl.value = MAX_LIMIT;

function filterByMaxPrice(list, maxPrice) {
    const result = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].price <= maxPrice) {
            result.push(list[i]);
        }
    }
    return result;
}

function createCard(product, maxPrice) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = product.id;

    if (product.price > maxPrice * 0.7) {
        card.classList.add('expensive');
    } else if (product.price < maxPrice * 0.3) {
        card.classList.add('cheap');
    }

    card.innerHTML = `
        <div class="emoji">${product.emoji}</div>
        <h3>${product.name}</h3>
        <div class="category">${product.category}</div>
        <div class="rating">★ ${product.rating}</div>
        <div class="price">${product.price.toLocaleString('ru-RU')} ₸</div>
    `;
    return card;
}

function renderCatalog(maxPrice) {
    const filtered = filterByMaxPrice(products, maxPrice);

    catalogEl.innerHTML = '';

    for (let i = 0; i < filtered.length; i++) {
        const card = createCard(filtered[i], maxPrice);
        catalogEl.appendChild(card);
    }

    if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = '😕 Товаров по заданной цене не найдено';
        catalogEl.appendChild(empty);
    }

    statsEl.textContent =
        `Показано: ${filtered.length} из ${products.length} товаров • ` +
        `Макс. цена: ${maxPrice.toLocaleString('ru-RU')} ₸`;
}

function getCurrentLimit() {
    const inputVal = parseFloat(maxPriceEl.value);
    return isNaN(inputVal) ? MAX_LIMIT : inputVal;
}

function applyFilter() {
    const limit = getCurrentLimit();
    renderCatalog(limit);
    rangeEl.value = Math.min(limit, MAX_LIMIT);
}

maxPriceEl.addEventListener('input', applyFilter);

rangeEl.addEventListener('input', () => {
    maxPriceEl.value = rangeEl.value;
    renderCatalog(parseFloat(rangeEl.value));
});

resetBtn.addEventListener('click', () => {
    maxPriceEl.value = '';
    rangeEl.value = MAX_LIMIT;
    renderCatalog(MAX_LIMIT);
});

maxPriceEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') applyFilter();
});

renderCatalog(MAX_LIMIT);