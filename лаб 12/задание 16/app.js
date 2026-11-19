// ИМИТАЦИЯ БАЗЫ ДАННЫХ И СЕРВЕРНОЙ ЧАСТИ
const DB_USERS = [
    { login: 'admin', password: 'admin123', role: 'admin', name: 'Главный Администратор' },
    { login: 'user', password: 'user123', role: 'user', name: 'Обычный Пользователь' }
];

// Имитация базы данных логов на сервере
let SERVER_LOGS = [];

// Функция записи в журнал
function writeLog(action, login) {
    const time = new Date().toLocaleTimeString();
    SERVER_LOGS.unshift(`[${time}] ${action}: ${login}`); // unshift добавляет в начало
}

// Имитация запросов к серверу
function fakeServerRequest(endpoint, data = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 1. ЛОГИН
            if (endpoint === '/api/login') {
                const user = DB_USERS.find(u => u.login === data.login && u.password === data.password);
                
                if (!user) {
                    writeLog('ОШИБКА ВХОДА', data.login); // Логируем неудачную попытку
                    return reject({ status: 401, error: 'Неверный логин или пароль' });
                }

                // Сохраняем сессию
                sessionStorage.setItem('session_login', user.login);
                sessionStorage.setItem('session_role', user.role);
                writeLog('УСПЕШНЫЙ ВХОД', user.login); // Логируем успех
                resolve({ status: 200 });
            }

            // 2. ЗАЩИЩЕННОЕ API (Получение данных пользователя)
            if (endpoint === '/api/me') {
                const sessionLogin = sessionStorage.getItem('session_login');
                if (!sessionLogin) return reject({ status: 401, error: 'Нет доступа' });
                
                const user = DB_USERS.find(u => u.login === sessionLogin);
                resolve({ status: 200, data: user, logs: SERVER_LOGS });
            }

            // 3. ЗАЩИЩЕННОЕ API АДМИНА (Проверка роли)
            if (endpoint === '/api/admin-data') {
                const sessionRole = sessionStorage.getItem('session_role');
                
                // Если роль не админ — выдаем 403 Forbidden
                if (sessionRole !== 'admin') {
                    return reject({ status: 403, error: 'Доступ запрещен (требуется роль admin)' });
                }
                resolve({ status: 200, message: 'Секретные данные' });
            }

            // 4. ВЫХОД
            if (endpoint === '/api/logout') {
                const sessionLogin = sessionStorage.getItem('session_login');
                if (sessionLogin) writeLog('ВЫХОД', sessionLogin); // Логируем выход
                sessionStorage.clear();
                resolve({ status: 200 });
            }
        }, 400);
    });
}

// КЛИЕНТСКАЯ ЛОГИКА (DOM)
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const errorMsg = document.getElementById('error-msg');
const adminPanel = document.getElementById('admin-panel');

// 1. ВХОД
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = 'Загрузка...';
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        await fakeServerRequest('/api/login', { login, password });
        loadDashboard(); // Если успех, грузим кабинет
    } catch (err) {
        errorMsg.textContent = err.error;
    }
});

// 2. ЗАГРУЗКА ЛИЧНОГО КАБИНЕТА
async function loadDashboard() {
    try {
        // Запрашиваем данные профиля (API проверит сессию)
        const response = await fakeServerRequest('/api/me');
        
        // Заполняем данные
        document.getElementById('user-name').textContent = response.data.name;
        document.getElementById('user-role').textContent = response.data.role;
        
        // Обновляем журнал логов из ответа сервера
        renderLogs(response.logs);

        // ПРОВЕРКА ПРАВ НА КЛИЕНТЕ (Просто чтобы скрыть кнопку, 
        // главная защита - это запрос к /api/admin-data ниже)
        if (response.data.role === 'admin') {
            try {
                await fakeServerRequest('/api/admin-data'); // Проверяем на сервере!
                adminPanel.hidden = false; // Показываем панель только если сервер разрешил
            } catch (err) {
                adminPanel.hidden = true;
            }
        } else {
            adminPanel.hidden = true; // Скрываем для обычных юзеров
        }

        // Переключаем экраны
        loginScreen.hidden = true;
        mainScreen.hidden = false;

    } catch (err) {
        alert(err.error);
        loginScreen.hidden = false;
        mainScreen.hidden = true;
    }
}

// 3. ОТРИСОВКА ЛОГОВ
function renderLogs(logs) {
    const list = document.getElementById('log-list');
    list.innerHTML = ''; // Очищаем
    
    if (logs.length === 0) {
        list.innerHTML = '<li>Событий пока нет...</li>';
        return;
    }

    logs.forEach(logText => {
        const li = document.createElement('li');
        li.textContent = logText;
        list.appendChild(li);
    });
}

// 4. ВЫХОД
document.getElementById('btn-logout').addEventListener('click', async () => {
    await fakeServerRequest('/api/logout');
    mainScreen.hidden = true;
    loginScreen.hidden = false;
    document.getElementById('loginForm').reset();
    errorMsg.textContent = '';
});

// 5. ПРОВЕРКА СЕССИИ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ (F5)
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('session_login')) {
        loadDashboard();
    }
});