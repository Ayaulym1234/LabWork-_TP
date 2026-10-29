// Ждем, пока загрузится вся страница (защита от ошибок)
document.addEventListener('DOMContentLoaded', () => {
    
    // Находим элементы
    const loadBtn  = document.querySelector('#load');
    const retryBtn = document.querySelector('#retry');
    const statusEl = document.querySelector('#status');
    const results  = document.querySelector('#results');

    const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

    function setStatus(text, type) {
        statusEl.textContent = text;
        statusEl.className = type;
    }

    function renderTodo(todo) {
        const item = document.createElement('li');
        
        const text = document.createElement('span');
        text.textContent = `${todo.id}. ${todo.title}`;

        if (todo.completed) {
            item.classList.add('done');
        }

        const starBtn = document.createElement('button');
        starBtn.className = 'star';
        starBtn.textContent = '☆';
        
        starBtn.addEventListener('click', () => {
            item.classList.toggle('favorite');
            starBtn.textContent = item.classList.contains('favorite') ? '★' : '☆';
        });

        item.append(text, starBtn);
        results.append(item);
    }

    async function loadTodos() {
        console.log("Кнопка нажата, начинаю загрузку..."); // Проверка в консоли
        
        loadBtn.disabled = true;
        retryBtn.hidden = true;
        results.replaceChildren(); 
        setStatus('Загрузка...', 'loading');

        try {
            const response = await fetch(API_URL);
            console.log("Ответ от сервера получен:", response.status); // Проверка

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const todos = await response.json();
            console.log("Данные:", todos); // Проверка данных

            for (const todo of todos) {
                renderTodo(todo);
            }
            setStatus(` Загружено задач: ${todos.length}`, 'success');

        } catch (error) {
            console.error("Ошибка:", error); // Покажет ошибку в консоли
            setStatus(`Ошибка: ${error.message}`, 'error');
            retryBtn.hidden = false;
        } finally {
            loadBtn.disabled = false;
        }
    }

    // Привязываем события
    if (loadBtn) {
        loadBtn.addEventListener('click', loadTodos);
    }
    if (retryBtn) {
        retryBtn.addEventListener('click', loadTodos);
    }
});