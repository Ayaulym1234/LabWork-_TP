const data = {
    books: [
        { id: 1,  title: "Мастер и Маргарита",            author: "М. Булгаков",       genre: "Роман",       year: 1967, cover: "📕" },
        { id: 2,  title: "Преступление и наказание",       author: "Ф. Достоевский",    genre: "Роман",       year: 1866, cover: "📗" },
        { id: 3,  title: "Война и мир",                    author: "Л. Толстой",        genre: "Роман",       year: 1869, cover: "📘" },
        { id: 4,  title: "1984",                           author: "Дж. Оруэлл",        genre: "Антиутопия",  year: 1949, cover: "📙" },
        { id: 5,  title: "Гарри Поттер и философский камень", author: "Дж. Роулинг",    genre: "Фэнтези",     year: 1997, cover: "📕" },
        { id: 6,  title: "Хоббит",                         author: "Дж. Толкин",        genre: "Фэнтези",     year: 1937, cover: "📗" },
        { id: 7,  title: "Краткая история времени",        author: "С. Хокинг",         genre: "Наука",       year: 1988, cover: "📘" },
        { id: 8,  title: "Сапиенс",                        author: "Ю. Харари",         genre: "История",     year: 2011, cover: "📙" },
        { id: 9,  title: "Абай жолы",                      author: "М. Ауэзов",         genre: "Роман",       year: 1942, cover: "📕" },
        { id: 10, title: "Кочевники",                      author: "И. Есенберлин",     genre: "История",     year: 1969, cover: "📗" },
        { id: 11, title: "Чистый код",                     author: "Р. Мартин",         genre: "IT",          year: 2008, cover: "📘" },
        { id: 12, title: "Гарри Поттер и Тайная комната",  author: "Дж. Роулинг",       genre: "Фэнтези",     year: 1998, cover: "📙" }
    ],
    about: {
        title: "О библиотеке",
        paragraphs: [
            "Городская библиотека — современное пространство для чтения и самообразования. Наш электронный каталог содержит более 12 000 книг: от классики до современных научных изданий.",
            "Мы поддерживаем образовательные инициативы, проводим читательские клубы и предоставляем доступ к редким изданиям."
        ],
        features: [
            { title: "Часы работы",     text: "Пн–Сб: 09:00 – 20:00" },
            { title: "Читальных залов", text: "4 зала, 200 мест" },
            { title: "Фонд",            text: "12 000+ книг" },
            { title: "Адрес",           text: "г. Алматы, ул. Абая, 15" }
        ]
    }
};

const content  = document.querySelector("#content");
const tabs     = document.querySelectorAll("[data-page]");
const favBadge = document.querySelector("#favBadge");

let favorites = new Set();
let state = { search: "", genre: "Все" };

// КЛАВИАТУРНАЯ НАВИГАЦИЯ
function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
        const tag = document.activeElement.tagName;
        const isTyping = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

        if (e.key === "Escape") {
            if (document.activeElement) document.activeElement.blur();
            return;
        }

        if (!isTyping && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
            const tabKeys = ["catalog", "favorites", "about"];
            const currentIdx = tabKeys.findIndex(k =>
                document.querySelector(`[data-page="${k}"]`).classList.contains("active"));
            const nextIdx = e.key === "ArrowRight"
                ? (currentIdx + 1) % tabKeys.length
                : (currentIdx - 1 + tabKeys.length) % tabKeys.length;

            navigate(tabKeys[nextIdx]);
            document.querySelector(`[data-page="${tabKeys[nextIdx]}"]`).focus();
            e.preventDefault();
            return;
        }

        if (e.altKey && ["1", "2", "3"].includes(e.key)) {
            const tabKeys = ["catalog", "favorites", "about"];
            const idx = parseInt(e.key, 10) - 1;
            navigate(tabKeys[idx]);
            document.querySelector(`[data-page="${tabKeys[idx]}"]`).focus();
            e.preventDefault();
            return;
        }

        if (e.key === "/" && !isTyping) {
            const search = document.querySelector(".toolbar input");
            if (search) {
                search.focus();
                e.preventDefault();
            }
        }
    });
}

function focusFirstTab() {
    const first = document.querySelector("[data-page]");
    if (first) first.focus();
}

// ИЗБРАННОЕ
function updateFavBadge() {
    favBadge.textContent = `❤ ${favorites.size}`;
}

function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }
    updateFavBadge();

    const btn = document.querySelector(`[data-fav-id="${id}"]`);
    if (btn) {
        btn.classList.toggle("active", favorites.has(id));
        btn.textContent = favorites.has(id) ? "❤ В избранном" : "♡ В избранное";
    }

    if (document.querySelector("[data-page='favorites']").classList.contains("active")) {
        navigate("favorites");
    }
}

// КАРТОЧКА КНИГИ
function createBookCard(book) {
    const card = document.createElement("div");
    card.className = "book";

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.textContent = book.cover;

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("div");
    author.className = "author";
    author.textContent = book.author;

    const meta = document.createElement("div");
    meta.className = "meta";

    const genreChip = document.createElement("span");
    genreChip.className = "chip";
    genreChip.textContent = book.genre;

    const yearChip = document.createElement("span");
    yearChip.className = "chip year";
    yearChip.textContent = book.year;

    meta.append(genreChip, yearChip);

    const isFav = favorites.has(book.id);
    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn" + (isFav ? " active" : "");
    favBtn.dataset.favId = book.id;
    favBtn.textContent = isFav ? "❤ В избранном" : "♡ В избранное";
    favBtn.addEventListener("click", () => toggleFavorite(book.id));

    card.append(cover, title, author, meta, favBtn);
    return card;
}

function createEmptyState(icon, text) {
    const empty = document.createElement("div");
    empty.className = "empty";

    const iconEl = document.createElement("span");
    iconEl.className = "icon";
    iconEl.textContent = icon;

    const textEl = document.createElement("span");
    textEl.textContent = text;

    empty.append(iconEl, textEl);
    return empty;
}

// РЕНДЕР: КАТАЛОГ
function renderCatalog() {
    const wrap = document.createElement("div");
    wrap.className = "fade-in";

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Поиск по названию или автору...";
    searchInput.value = state.search;
    searchInput.addEventListener("input", (e) => {
        state.search = e.target.value;
        navigate("catalog");
    });

    const genreSelect = document.createElement("select");
    const genres = ["Все", ...new Set(data.books.map(b => b.genre))];
    genres.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.textContent = g;
        if (g === state.genre) opt.selected = true;
        genreSelect.append(opt);
    });
    genreSelect.addEventListener("change", (e) => {
        state.genre = e.target.value;
        navigate("catalog");
    });

    toolbar.append(searchInput, genreSelect);
    wrap.append(toolbar);

    let books = data.books;
    if (state.genre !== "Все") {
        books = books.filter(b => b.genre === state.genre);
    }
    if (state.search.trim()) {
        const q = state.search.trim().toLowerCase();
        books = books.filter(b =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q)
        );
    }

    const grid = document.createElement("div");
    grid.className = "grid";

    if (books.length === 0) {
        grid.append(createEmptyState("🔍", "По вашему запросу ничего не найдено"));
    } else {
        books.forEach(b => grid.append(createBookCard(b)));
    }

    wrap.append(grid);

    if (state.search) {
        setTimeout(() => {
            searchInput.focus();
            searchInput.setSelectionRange(state.search.length, state.search.length);
        }, 0);
    }

    return wrap;
}

// РЕНДЕР: ИЗБРАННОЕ
function renderFavorites() {
    const wrap = document.createElement("div");
    wrap.className = "fade-in";

    const grid = document.createElement("div");
    grid.className = "grid";

    const favBooks = data.books.filter(b => favorites.has(b.id));

    if (favBooks.length === 0) {
        grid.append(createEmptyState("💔",
            "В избранном пока пусто. Добавьте книги из каталога."));
    } else {
        favBooks.forEach(b => grid.append(createBookCard(b)));
    }

    wrap.append(grid);
    return wrap;
}

// РЕНДЕР: О БИБЛИОТЕКЕ
function renderAbout() {
    const wrap = document.createElement("div");
    wrap.className = "about fade-in";

    const title = document.createElement("h2");
    title.textContent = data.about.title;
    wrap.append(title);

    data.about.paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        wrap.append(p);
    });

    const featuresBox = document.createElement("div");
    featuresBox.className = "features";

    data.about.features.forEach(f => {
        const card = document.createElement("div");
        card.className = "feature";

        const b = document.createElement("b");
        b.textContent = f.title;

        const span = document.createElement("span");
        span.textContent = f.text;

        card.append(b, span);
        featuresBox.append(card);
    });

    wrap.append(featuresBox);
    return wrap;
}

// КАРТА СТРАНИЦ И НАВИГАЦИЯ
const pages = {
    catalog:   renderCatalog,
    favorites: renderFavorites,
    about:     renderAbout
};

function navigate(pageKey) {
    const render = pages[pageKey];
    if (!render) return;

    content.replaceChildren(render());

    tabs.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.page === pageKey);
    });

    document.title = "Каталог книг — " + pageKey;
}

// СОБЫТИЯ ВКЛАДОК
tabs.forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
});

// ИНИЦИАЛИЗАЦИ
setupKeyboardNavigation();
updateFavBadge();
navigate("catalog");
focusFirstTab();