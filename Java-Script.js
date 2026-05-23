document.addEventListener("DOMContentLoaded", () => {
    const initialItems = [
        { name: "Печиво", quantity: 2, purchased: false },
        { name: "Сир", quantity: 1, purchased: false },
        { name: "Помідори", quantity: 2, purchased: true }
    ];

    let items = initialItems.map((item, i) => ({ ...item, id: i + 1 }));
    let nextId = items.length + 1;

    const listEl = document.querySelector(".list-card ul");
    const formEl = document.querySelector("form");
    const inputEl = document.getElementById("product-name");
    const statusLists = document.querySelectorAll(".status-list");
    const remainingListEl = statusLists[0];
    const purchasedListEl = statusLists[1];

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function renderItem(item) {
        if (item.purchased) {
            return `
                <li class="is-purchased" data-id="${item.id}">
                    <span class="product-name">${escapeHtml(item.name)}</span>
                    <div class="counter counter--static">
                        <span class="amount">${item.quantity}</span>
                    </div>
                    <button type="button" class="btn-buy" data-tooltip="Повернути в список" data-action="toggle">
                        Не куплено
                    </button>
                </li>
            `;
        }
        const isMin = item.quantity === 1;
        return `
            <li data-id="${item.id}">
                <span class="product-name" data-action="edit">${escapeHtml(item.name)}</span>
                <div class="counter">
                    <button type="button" class="btn-minus${isMin ? " is-disabled" : ""}" aria-label="Зменшити кількість" data-tooltip="${isMin ? "Мінімальна кількість" : "Зменшити"}" data-action="decrement"> − </button>
                    <span class="amount">${item.quantity}</span>
                    <button type="button" class="btn-plus" aria-label="Збільшити кількість" data-tooltip="Збільшити" data-action="increment"> + </button>
                </div>
                <button type="button" class="btn-buy" data-tooltip="Позначити як куплене" data-action="toggle">
                    Куплено
                </button>
                <button type="button" class="btn-delete" aria-label="Видалити товар" data-tooltip="Видалити" data-action="delete"> × </button>
            </li>
        `;
    }

    function renderStats() {
        const remaining = items.filter(i => !i.purchased);
        const purchased = items.filter(i => i.purchased);

        remainingListEl.innerHTML = remaining.map(item =>
            `<span class="status-badge">${escapeHtml(item.name)} <span class="status-count">${item.quantity}</span></span>`
        ).join("");

        purchasedListEl.innerHTML = purchased.map(item =>
            `<span class="status-badge is-purchased">${escapeHtml(item.name)} <span class="status-count">${item.quantity}</span></span>`
        ).join("");
    }

    function render() {
        listEl.innerHTML = items.map(renderItem).join("");
        renderStats();
    }

    function handleAction(action, item, li) {
        switch (action) {
            case "toggle":
                item.purchased = !item.purchased;
                render();
                break;
            case "delete":
                items = items.filter(i => i.id !== item.id);
                render();
                break;
            case "increment":
                item.quantity++;
                render();
                break;
            case "decrement":
                if (item.quantity > 1) {
                    item.quantity--;
                    render();
                }
                break;
            case "edit":
                startEditing(li, item);
                break;
        }
    }

    function startEditing(li, item) {
        const nameEl = li.querySelector(".product-name");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "product-name-input";
        input.value = item.name;
        nameEl.replaceWith(input);
        input.focus();
        input.select();

        const finish = () => {
            const newName = input.value.trim();
            if (newName) item.name = newName;
            render();
        };

        input.addEventListener("blur", finish, { once: true });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") input.blur();
            if (e.key === "Escape") {
                input.value = item.name;
                input.blur();
            }
        });
    }

    listEl.addEventListener("click", (e) => {
        const actionEl = e.target.closest("[data-action]");
        if (!actionEl) return;
        const li = actionEl.closest("li[data-id]");
        if (!li) return;
        const id = parseInt(li.dataset.id);
        const item = items.find(i => i.id === id);
        if (!item) return;
        handleAction(actionEl.dataset.action, item, li);
    });

    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = inputEl.value.trim();
        if (!name) return;
        items.push({ id: nextId++, name, quantity: 1, purchased: false });
        inputEl.value = "";
        inputEl.focus();
        render();
    });

    render();
});
