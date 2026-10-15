const data = {
    profile: {
        name: "Юнусхожаева Аяулым",
        group: "Группа ИС 25-21 • 2 курс",
        avatar: "🎓"
    },
    about: {
        title: "О себе",
        paragraphs: [
            "Привет! Меня зовут Юнусхожаева Аяулым, я студент 2 курса направления «Информационные системы». Группа ИС 25-21.",
            "Увлекаюсь веб-разработкой и мобильными приложениями. Люблю решать алгоритмические задачи.",
            "Моя цель — стать разработчиком и создавать удобные сервисы."
        ],
        info: [
            { label: "Город",       value: "Алматы" },
            { label: "Направление", value: "Информационные системы" },
            { label: "Группа",      value: "ИС 25-21" },
            { label: "Курс",        value: "2 курс" },
            { label: "Интересы",    value: "Веб, мобильная разработка" },
            { label: "Языки",       value: "Русский, Қазақша, English" }
        ]
    },
    skills: {
        title: "Мои навыки",
        list: [
            { name: "HTML / CSS",   level: 85 },
            { name: "JavaScript",   level: 75 },
            { name: "Python",       level: 70 },
            { name: "SQL",          level: 60 },
            { name: "Git / GitHub", level: 65 },
            { name: "Алгоритмы",    level: 70 }
        ],
        tags: [
            "DOM API", "Flexbox", "Grid", "ES6+",
            "ООП", "Алгоритмы", "Git", "Figma"
        ]
    },
    contacts: {
        title: "Свяжитесь со мной",
        items: [
            { icon: "📧", label: "Email",   value: "unushozaevaaaulym@gmail.com", href: "mailto:unushozaevaaaulym@gmail.com" },
            { icon: "📱", label: "Телефон", value: "+7 708 170 82 61",             href: "tel:+77081708261" }
        ]
    }
};

const content = document.querySelector("#content");
const tabs    = document.querySelectorAll("[data-page]");

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
            const tabKeys = ["about", "skills", "contacts"];
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
            const tabKeys = ["about", "skills", "contacts"];
            const idx = parseInt(e.key, 10) - 1;
            navigate(tabKeys[idx]);
            document.querySelector(`[data-page="${tabKeys[idx]}"]`).focus();
            e.preventDefault();
            return;
        }
    });
}

function focusFirstTab() {
    const first = document.querySelector("[data-page]");
    if (first) first.focus();
}

// РЕНДЕР: О СЕБЕ
function renderAbout() {
    const wrap = document.createElement("div");
    wrap.className = "about fade-in";

    data.about.paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        wrap.append(p);
    });

    const grid = document.createElement("div");
    grid.className = "info-grid";
    data.about.info.forEach(item => {
        const card = document.createElement("div");
        card.className = "info-card";

        const label = document.createElement("b");
        label.textContent = item.label;

        const val = document.createElement("span");
        val.textContent = item.value;

        card.append(label, val);
        grid.append(card);
    });

    wrap.append(grid);
    return wrap;
}

// РЕНДЕР: НАВЫКИ
function renderSkills() {
    const wrap = document.createElement("div");
    wrap.className = "skills fade-in";

    const title = document.createElement("h2");
    title.textContent = data.skills.title;
    wrap.append(title);

    data.skills.list.forEach(skill => {
        const item = document.createElement("div");
        item.className = "skill";

        const header = document.createElement("div");
        header.className = "skill-header";

        const name = document.createElement("span");
        name.textContent = skill.name;

        const percent = document.createElement("span");
        percent.textContent = skill.level + "%";

        header.append(name, percent);

        const bar = document.createElement("div");
        bar.className = "skill-bar";

        const fill = document.createElement("div");
        fill.className = "skill-fill";
        bar.append(fill);

        item.append(header, bar);
        wrap.append(item);

        requestAnimationFrame(() => {
            setTimeout(() => { fill.style.width = skill.level + "%"; }, 50);
        });
    });

    const tagsTitle = document.createElement("h2");
    tagsTitle.textContent = "Технологии";
    tagsTitle.style.marginTop = "24px";
    wrap.append(tagsTitle);

    const tagsBox = document.createElement("div");
    tagsBox.className = "tags";
    data.skills.tags.forEach(t => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tagsBox.append(tag);
    });
    wrap.append(tagsBox);

    return wrap;
}

// РЕНДЕР: КОНТАКТЫ
function renderContacts() {
    const wrap = document.createElement("div");
    wrap.className = "contacts fade-in";

    const title = document.createElement("h2");
    title.textContent = data.contacts.title;
    wrap.append(title);

    data.contacts.items.forEach(item => {
        const link = document.createElement("a");
        link.className = "contact-item";
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const icon = document.createElement("div");
        icon.className = "contact-icon";
        icon.textContent = item.icon;

        const info = document.createElement("div");

        const label = document.createElement("div");
        label.className = "contact-label";
        label.textContent = item.label;

        const value = document.createElement("div");
        value.className = "contact-value";
        value.textContent = item.value;

        info.append(label, value);
        link.append(icon, info);
        wrap.append(link);
    });

    return wrap;
}

// КАРТА СТРАНИЦ И НАВИГАЦИЯ
const pages = {
    about:    renderAbout,
    skills:   renderSkills,
    contacts: renderContacts
};

function navigate(pageKey) {
    const render = pages[pageKey];
    if (!render) return;

    content.replaceChildren(render());

    tabs.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.page === pageKey);
    });

    document.title = "Визитка — " + pageKey;
}

// СОБЫТИЯ ВКЛАДОК
tabs.forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
});

// ПРОФИЛЬ В ШАПКЕ
function fillProfile() {
    document.querySelector("#studentName").textContent = data.profile.name;
    document.querySelector("#studentGroup").textContent = data.profile.group;
    document.querySelector(".avatar").textContent = data.profile.avatar;
}

// ИНИЦИАЛИЗАЦИЯ
setupKeyboardNavigation();
fillProfile();
navigate("about");
focusFirstTab();