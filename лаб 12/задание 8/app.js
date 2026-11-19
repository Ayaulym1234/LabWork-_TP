// ИМИТАЦИЯ БАЗЫ ДАННЫХ И СЕРВЕРА
const DB_USERS = [
    { login: 'student', password: '123', role: 'student', name: 'Иван Студентов' },
    { login: 'teacher', password: '456', role: 'teacher', name: 'Петр Преподавателев' }
];

function fakeServerRequest(endpoint, data = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 1. ЛОГИН
            if (endpoint === '/api/login') {
                const user = DB_USERS.find(u => u.login === data.login && u.password === data.password);
                if (!user) return reject({ status: 401, error: 'Неверный логин или пароль' });
                
                // Сохраняем сессию (в реальности сервер выдал бы Cookie)
                sessionStorage.setItem('session_login', user.login);
                sessionStorage.setItem('session_role', user.role);
                resolve({ status: 200 });
            }

            // 2. ПОЛУЧЕНИЕ ДАННЫХ (Строгая проверка ролей)
            if (endpoint.startsWith('/api/page/')) {
                const sessionLogin = sessionStorage.getItem('session_login');
                const sessionRole = sessionStorage.getItem('session_role');

                // Проверка 1: Авторизован ли вообще? (401)
                if (!sessionLogin) {
                    return reject({ status: 401, error: 'Вы не авторизованы!' });
                }

                const user = DB_USERS.find(u => u.login === sessionLogin);

                // Проверка 2: Доступ к странице студента (403)
                if (endpoint === '/api/page/student' && sessionRole !== 'student') {
                    return reject({ status: 403, error: 'Доступ запрещен! Вы не студент.' });
                }

                // Проверка 3: Доступ к странице препода (403)
                if (endpoint === '/api/page/teacher' && sessionRole !== 'teacher') {
                    return reject({ status: 403, error: 'Доступ запрещен! Вы не преподаватель.' });
                }

                resolve({ status: 200, data: user });
            }

            // 3. ВЫХОД
            if (endpoint === '/api/logout') {
                sessionStorage.clear();
                resolve({ status: 200 });
            }
        }, 400); // Задержка сети 0.4 сек
    });
}

// КЛИЕНТСКАЯ ЛОГИКА (DOM)
const screens = {
    login: document.getElementById('login-screen'),
    student: document.getElementById('student-screen'),
    teacher: document.getElementById('teacher-screen')
};

const errorMsg = document.getElementById('error-msg');
const loginForm = document.getElementById('loginForm');

// Функция переключения экранов
function showScreen(screenName) {
    Object.values(screens).forEach(el => el.hidden = true); // Скрываем все
    screens[screenName].hidden = false; // Показываем нужный
}

// 1. ОБРАБОТКА ВХОДА
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = 'Загрузка...';
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        await fakeServerRequest('/api/login', { login, password });
        checkSessionAndLoad(); // Если успех, проверяем кто вошел и грузим страницу
    } catch (err) {
        errorMsg.textContent = err.error;
    }
});

// 2. ЗАГРУЗКА НУЖНОЙ СТРАНИЦЫ (Проверка ролей)
async function checkSessionAndLoad() {
    const role = sessionStorage.getItem('session_role');
    
    if (!role) {
        showScreen('login');
        return;
    }

    try {
        if (role === 'student') {
            const res = await fakeServerRequest('/api/page/student');
            document.getElementById('student-name').textContent = res.data.name;
            showScreen('student');
        } else if (role === 'teacher') {
            const res = await fakeServerRequest('/api/page/teacher');
            document.getElementById('teacher-name').textContent = res.data.name;
            showScreen('teacher');
        }
    } catch (err) {
        // Если сервер вернул 401 или 403
        alert(err.error);
        sessionStorage.clear(); // Сбрасываем сессию
        showScreen('login');
    }
}

// 3. ВЫХОД (Кнопки есть и у студента, и у препода)
function handleLogout() {
    fakeServerRequest('/api/logout').then(() => {
        loginForm.reset();
        errorMsg.textContent = '';
        showScreen('login');
    });
}

document.getElementById('btn-logout-student').addEventListener('click', handleLogout);
document.getElementById('btn-logout-teacher').addEventListener('click', handleLogout);

// 4. ЗАПУСК ПРИ ЗАГРУЗКЕ (F5)
window.addEventListener('DOMContentLoaded', checkSessionAndLoad);