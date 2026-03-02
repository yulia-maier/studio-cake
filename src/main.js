// Header
const burger = document.getElementById("burger");
const nav = document.getElementById("navigation");
const closeMenu = document.getElementById("closeMenu");

const hasHeaderControls = Boolean(burger && nav && closeMenu);

function setBurgerState(isOpen) {
    if (!hasHeaderControls) return;
    nav.classList.toggle("is-open", isOpen);
    burger.classList.toggle("is-hidden", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
}

if (hasHeaderControls) {
    burger.addEventListener("click", () => {
        setBurgerState(true);
    });

    closeMenu.addEventListener("click", () => {
        setBurgerState(false);
    });

    nav.addEventListener("click", (event) => {
        const link = event.target.closest(".nav__link");
        if (!link) return;

        const targetId = link.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;

        event.preventDefault();

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        setBurgerState(false);

        targetSection.scrollIntoView({
            behavior: "smooth"
        });
    });

    document.addEventListener("click", (event) => {
        if (!nav.classList.contains("is-open")) return;
        const isClickInside =
            nav.contains(event.target) || burger.contains(event.target);
        if (isClickInside) return;
        setBurgerState(false);
    });
}



//Shop & Form
const form = document.querySelector(".form__body");
const nameInput = form.querySelector('input[name="name"]');
const phoneInput = form.querySelector('input[name="phone"]');
const dessertTextarea = form.querySelector('textarea[name="dessert"]');

const shop = document.querySelector(".shop");
const formSection = document.getElementById("form");

if (shop && dessertTextarea) {
    shop.addEventListener("click", (event) => {
        const button = event.target.closest(".shop__card-button");
        if (!button) return;

        event.preventDefault();
        const card = button.closest(".shop__card");
        if (!card) return;

        const titleEl = card.querySelector(".shop__card-title");
        if (!titleEl) return;

        const dessertName = titleEl.textContent.trim();
        addDessertToTextarea(dessertName);

        formSection.scrollIntoView({behavior: "smooth"});
        dessertTextarea.focus();
    });
}

function addDessertToTextarea(dessertName) {
    const desserts = dessertTextarea.value
        .split(",")
        .map(d => d.trim())
        .filter(Boolean);

    if (!desserts.includes(dessertName)) {
        desserts.push(dessertName);
    }

    dessertTextarea.value = desserts.join(", ");
}


// --- PHONE MASK ---
phoneInput.addEventListener("input", handlePhoneInput);
phoneInput.addEventListener("focus", handlePhoneFocus);
phoneInput.addEventListener("blur", handlePhoneBlur);

function handlePhoneFocus() {
    if (!phoneInput.value) {
        phoneInput.value = "+375-";
    }
}

function handlePhoneBlur() {
    if (phoneInput.value === "+375-") {
        phoneInput.value = "";
    }
}


function handlePhoneInput() {
    let value = phoneInput.value.replace(/\D/g, "");
    if (!value.startsWith("375")) {
        value = "375";
    }

    value = value.slice(3);

    let result = "+375";

    if (value.length > 0) result += "-" + value.slice(0, 2);
    if (value.length > 2) result += "-" + value.slice(2, 5);
    if (value.length > 4) result += "-" + value.slice(5, 7);
    if (value.length > 6) result += "-" + value.slice(7, 9);

    phoneInput.value = result;
}


form.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasError = false;

    const nameValue = nameInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const dessertValue = dessertTextarea.value.trim();

    // --- NAME VALIDATION ---
    if (!/^[А-Яа-яЁё\s]{2,}$/.test(nameValue)) {
        nameInput.setCustomValidity(
            "Введите имя русскими буквами, минимум 2 символа"
        );
        hasError = true;
    } else {
        nameInput.setCustomValidity("");
    }

    // --- PHONE VALIDATION ---
    if (!/^\+375-\d{2}-\d{3}-\d{2}-\d{2}$/.test(phoneValue)) {
        phoneInput.setCustomValidity(
            "Введите телефон в формате +375-XX-XXX-XX-XX"
        );
        hasError = true;
    } else {
        phoneInput.setCustomValidity("");
    }

    if (hasError) {
        form.reportValidity();
        return;
    }

    // ===== УСПЕШНАЯ ОТПРАВКА =====
    // Здесь будет fetch()

    console.log("✅ Форма отправлена успешно");

    const formData = {
        name: nameValue,
        phone: phoneValue,
        dessert: dessertValue || "Не выбран",
    };

    console.log("📦 Отправленные данные:", formData);
    form.reset()
});


[nameInput, phoneInput].forEach(input => {
    input.addEventListener("input", () => {
        input.setCustomValidity("");
    });
});

