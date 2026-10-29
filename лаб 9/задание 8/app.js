// ===== 1. Получаем элементы страницы =====
const loadBtn  = document.querySelector('#load');
const searchEl = document.querySelector('#search');
const statusEl = document.querySelector('#status');
const results  = document.querySelector('#results');

// ===== 2. Настройки =====
const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=20';

// Здесь будем хранить все загруженные публикации
let allPosts = [];

// ===== 3. Функция статуса =====
function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = type;
}

// ===== 4. Отрисовка одной публикации =====
function renderPost(post) {
    const item = document.createElement('li');
    item.dataset.id = post.id;

    // Левая часть: текст
    const textWrap = document.createElement('div');
    textWrap.className = 'text';

    const idSpan = document.createElement('span');
    idSpan.className = 'id';
    idSpan.textContent = `${post.id}. `;

    const titleSpan = document.createElement('span');
    titleSpan.textContent = post.title;

    textWrap.append(idSpan, titleSpan);

    // Правая часть: кнопка избранного
    const starBtn = document.createElement('button');
    starBtn.className = 'star';
    starBtn.textContent = '☆'; // Пустая звезда
    starBtn.title = 'В избранное';

    starBtn.addEventListener('click', () => {
        const isFav = item.classList.toggle('favorite');
        starBtn.classList.toggle('active', isFav);
        starBtn.textContent = isFav ? '★' : '☆'; // Закрашенная / пустая
    });

    item.append(textWrap, starBtn);
    results.append(item);
}

// ===== 5. Функция фильтрации (поиск) =====
function filterPosts() {
    // Берем текст из поля поиска, приводим к нижнему регистру
    const query = searchEl.value.toLowerCase().trim();

    // Очищаем список
    results.replaceChildren();

    // Если поле поиска пустое — показываем всё
    let filtered = allPosts;
    if (query !== '') {
        filtered = allPosts.filter(post =>
            post.title.toLowerCase().includes(query)
        );
    }

    // Отрисовываем результат
    if (filtered.length === 0) {
        setStatus(`Ничего не найдено по запросу "${query}"`, 'error');
        return;
    }

    for (const post of filtered) {
        renderPost(post);
    }

    // Показываем статус
    if (query === '') {
        setStatus(`Загружено публикаций: ${filtered.length}`, 'success');
    } else {
        setStatus(`Найдено: ${filtered.length} из ${allPosts.length}`, 'success');
    }
}

// ===== 6. Загрузка с сервера =====
async function loadPosts() {
    loadBtn.disabled = true;
    results.replaceChildren();
    setStatus('Загрузка...', 'loading');
    searchEl.hidden = true;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        allPosts = await response.json();   // запоминаем все данные

        // Показываем всё
        filterPosts();

        // Показываем поле поиска
        searchEl.hidden = false;
        searchEl.value = '';

    } catch (error) {
        setStatus(`Ошибка: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
    }
}

// ===== 7. События =====
loadBtn.addEventListener('click', loadPosts);

// Событие ввода в поле поиска — фильтруем при каждом нажатии клавиши
searchEl.addEventListener('input', filterPosts);