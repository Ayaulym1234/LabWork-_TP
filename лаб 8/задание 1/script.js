//Элементы DOM
const inputName   = document.getElementById('itemName');
const inputQty    = document.getElementById('itemQty');
const addBtn      = document.getElementById('addBtn');
const listEl      = document.getElementById('list');
const emptyEl     = document.getElementById('empty');
const hintEl      = document.getElementById('hint');
const storageRadios = document.querySelectorAll('input[name="storage"]');
const exportBtn   = document.getElementById('exportBtn');
const importFile  = document.getElementById('importFile');
const clearBtn    = document.getElementById('clearBtn');

// Константы и состояние
const STORAGE_KEY = 'lab8_shopping';
let storageMode = 'local';
let items = [];

// Безопасный доступ к хранилищу (защита от SecurityError)
function getStorage() {
    try {
        const s = storageMode === 'local' ? localStorage : sessionStorage;
        const probe = '__probe__';
        s.setItem(probe, '1');
        s.removeItem(probe);
        return s;
    } catch (e) {
        console.warn('Web Storage недоступен:', e.message);
        return null;
    }
}

//  Загрузка с полной защитой
function loadItems() {
    items = [];
    const storage = getStorage();
    if (!storage) {
        console.warn('Хранилище недоступно — работаем без сохранения');
        return;
    }
    let raw = null;
    try {
        raw = storage.getItem(STORAGE_KEY);
    } catch (e) {
        console.warn('Ошибка чтения из хранилища:', e.message);
        return;
    }
    if (!raw) return;

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            items = parsed.filter(
                x => x && typeof x.name === 'string' && typeof x.qty === 'number'
            );
        }
    } catch (e) {
        console.warn('Повреждённый JSON, сбрасываю:', e.message);
        try { storage.removeItem(STORAGE_KEY); } catch {}
    }
}

// Сохранение с защитой
function saveItems() {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.warn('Ошибка записи в хранилище:', e.message);
    }
}

// Отрисовка
function render() {
    listEl.replaceChildren();
    emptyEl.classList.toggle('hidden', items.length > 0);

    items.forEach((item, index) => {
        const li = document.createElement('li');

        const info = document.createElement('span');
        info.className = 'info';
        info.textContent = item.name;

        const qty = document.createElement('span');
        qty.className = 'qty';
        qty.textContent = `× ${item.qty}`;

        const del = document.createElement('button');
        del.textContent = 'Удалить';
        del.addEventListener('click', () => {
            items.splice(index, 1);
            saveItems();
            render();
        });

        li.append(info, qty, del);
        listEl.append(li);
    });
}

// Добавление
function addItem() {
    const name = inputName.value.trim();
    const qty  = parseInt(inputQty.value, 10);
    hintEl.textContent = '';

    if (!name) {
        hintEl.textContent = 'Введите название товара';
        inputName.focus();
        return;
    }
    if (!qty || qty < 1) {
        hintEl.textContent = 'Количество должно быть ≥ 1';
        inputQty.focus();
        return;
    }
    items.push({ name, qty });
    inputName.value = '';
    inputQty.value = 1;
    inputName.focus();
    saveItems();
    render();
}

// Импорт / экспорт
function importFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) {
                alert('Ожидается массив товаров в JSON');
                return;
            }
            const valid = data.filter(
                x => x && typeof x.name === 'string' &&
                     typeof x.qty === 'number' && x.qty > 0
            );
            if (valid.length === 0) {
                alert('В файле нет корректных товаров');
                return;
            }
            items = valid;
            saveItems();
            render();
            alert(`Импортировано ${valid.length} товаров`);
        } catch (err) {
            alert('Ошибка чтения JSON: ' + err.message);
        }
    };
    reader.onerror = () => alert('Не удалось прочитать файл');
    reader.readAsText(file);
}

function exportToFile() {
    if (items.length === 0) {
        alert('Список пуст — нечего экспортировать');
        return;
    }
    const blob = new Blob(
        [JSON.stringify(items, null, 2)],
        { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// События
addBtn.addEventListener('click', addItem);

inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addItem();
});

storageRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (!e.target.checked) return;
        storageMode = e.target.value;
        loadItems();
        render();
    });
});

exportBtn.addEventListener('click', exportToFile);

importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importFromFile(file);
    e.target.value = '';
});

clearBtn.addEventListener('click', () => {
    if (items.length === 0) return;
    if (!confirm('Удалить все товары из текущего хранилища?')) return;
    items = [];
    const storage = getStorage();
    if (storage) {
        try { storage.removeItem(STORAGE_KEY); } catch {}
    }
    render();
});

// Инициализация с защитой от падения
try {
    loadItems();
    render();
} catch (e) {
    console.error('Ошибка инициализации:', e);
    items = [];
    render();
}