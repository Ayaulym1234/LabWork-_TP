// ===== 1. Получаем элементы страницы =====
const loadBtn      = document.querySelector('#load');
const statusEl     = document.querySelector('#status');
const results      = document.querySelector('#results');
const statsBlock   = document.querySelector('#stats');
const userFilter   = document.querySelector('#userFilter');
const totalCount   = document.querySelector('#totalCount');
const doneCount    = document.querySelector('#doneCount');
const pendingCount = document.querySelector('#pendingCount');

// ===== 2. Настройки =====
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Храним все загруженные задачи
let allTodos = [];

// ===== 3. Функция статуса =====
function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = type;
}

// ===== 4. Отрисовка одной задачи =====
function renderTodo(todo) {
    const item = document.createElement('li');
    
    // Если выполнено - добавляем класс (CSS сделает зеленым и зачеркнет)
    if (todo.completed) {
        item.classList.add('done');
    }

    // Левая часть (Бейдж пользователя + текст)
    const leftPart = document.createElement('div');
    
    const badge = document.createElement('span');
    badge.className = 'user-badge';
    badge.textContent = `User ${todo.userId}`; // Показываем ID пользователя
    
    const title = document.createElement('span');
    title.textContent = todo.title;

    leftPart.append(badge, title);
    
    // Правая часть (статус)
    const statusSpan = document.createElement('span');
    statusSpan.textContent = todo.completed ? 'Выполнено' : 'В процессе';
    statusSpan.style.fontSize = '12px';
    statusSpan.style.color = todo.completed ? '#28a745' : '#856404';

    item.append(leftPart, statusSpan);
    results.append(item);
}

// ===== 5. Обновление статистики =====
function updateStats(todos) {
    const total = todos.length;
    // Считаем количество выполненных через filter
    const done = todos.filter(todo => todo.completed).length;
    const pending = total - done;

    totalCount.textContent = total;
    doneCount.textContent = done;
    pendingCount.textContent = pending;
}

// ===== 6. Фильтрация и отрисовка =====
function applyFilterAndRender() {
    const selectedUserId = userFilter.value; // 'all' или конкретный ID

    // Фильтруем массив
    let filtered = allTodos;
    if (selectedUserId !== 'all') {
        filtered = allTodos.filter(todo => todo.userId === Number(selectedUserId));
    }

    // Обновляем статистику (для отфильтрованных данных)
    updateStats(filtered);

    // Перерисовываем список
    results.replaceChildren();
    if (filtered.length === 0) {
        setStatus('Нет задач для выбранного пользователя', 'error');
        return;
    }

    for (const todo of filtered) {
        renderTodo(todo);
    }

    setStatus(`Показано задач: ${filtered.length}`, 'success');
}

// ===== 7. Загрузка с сервера =====
async function loadTodos() {
    loadBtn.disabled = true;
    results.replaceChildren();
    statsBlock.hidden = true;
    userFilter.hidden = true;
    setStatus('Загрузка...', 'loading');

    try {
        // Загружаем задачи (без лимита, чтобы получить все для дашборда)
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        allTodos = await response.json();

        // Настраиваем выпадающий список (уникальные userId)
        setupUserFilter();

        // Показываем интерфейс
        userFilter.hidden = false;
        statsBlock.hidden = false;

        // Отрисовываем все задачи
        applyFilterAndRender();

    } catch (error) {
        setStatus(`Ошибка: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
    }
}

// ===== 8. Настройка фильтра по пользователям =====
function setupUserFilter() {
    // Очищаем старые опции (кроме "Все")
    userFilter.innerHTML = '<option value="all">Все пользователи</option>';
    userFilter.value = 'all';

    // Собираем уникальные userId
    const userIds = [];
    for (const todo of allTodos) {
        if (!userIds.includes(todo.userId)) {
            userIds.push(todo.userId);
        }
    }

    // Сортируем по возрастанию
    userIds.sort((a, b) => a - b);

    // Создаем опции через DOM (безопасно)
    for (const id of userIds) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `Пользователь ${id}`;
        userFilter.append(option);
    }
}

// ===== 9. События =====
loadBtn.addEventListener('click', loadTodos);
userFilter.addEventListener('change', applyFilterAndRender);