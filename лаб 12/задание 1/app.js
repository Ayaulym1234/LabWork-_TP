// 1. Тестовая база пользователей (в реальности это на сервере)
const users = [
    { login: 'student1', password: '12345', name: 'Иван' }
];

// 2. Находим все элементы на странице
const loginBlock = document.getElementById('login-block');
const profileBlock = document.getElementById('profile-block');
const errorMsg = document.getElementById('error');
const userName = document.getElementById('user-name');

// 3. ФУНКЦИЯ ВХОДА
document.getElementById('login-btn').addEventListener('click', function() {
    const loginValue = document.getElementById('login').value;
    const passwordValue = document.getElementById('password').value;

    // Очищаем старые ошибки
    errorMsg.textContent = '';

    // Проверка на пустые поля (Ошибка 400)
    if (loginValue === '' || passwordValue === '') {
        errorMsg.textContent = 'Заполните все поля!';
        return; // Останавливаем выполнение
    }

    // Ищем пользователя
    const user = users.find(u => u.login === loginValue && u.password === passwordValue);

    // Проверка на неверный пароль (Ошибка 401)
    if (!user) {
        errorMsg.textContent = 'Неверный логин или пароль';
        return;
    }

    // УСПЕХ! Имитируем серверную сессию
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('userName', user.name);

    showProfile();
});

// 4. ФУНКЦИЯ ПОКАЗА ПРОФИЛЯ
function showProfile() {
    // Проверяем, есть ли сессия (защита ресурса)
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        alert('Доступ запрещен (401)');
        return;
    }

    // Показываем кабинет, скрываем форму
    userName.textContent = sessionStorage.getItem('userName');
    loginBlock.style.display = 'none';
    profileBlock.style.display = 'block';
}

// 5. ФУНКЦИЯ ВЫХОДА
document.getElementById('logout-btn').addEventListener('click', function() {
    // Уничтожаем сессию
    sessionStorage.clear();
    
    // Скрываем кабинет, показываем форму
    profileBlock.style.display = 'none';
    loginBlock.style.display = 'block';
    
    // Очищаем поля
    document.getElementById('login').value = '';
    document.getElementById('password').value = '';
    errorMsg.textContent = '';
});

// 6. ПРОВЕРКА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ (чтобы при F5 не выкидывало)
if (sessionStorage.getItem('loggedIn') === 'true') {
    showProfile();
}