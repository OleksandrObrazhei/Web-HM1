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
                    <button type="button" class="btn-buy" data-tooltip="Повернути в список">
                        Не куплено
                    </button>
                </li>
            `;
        }
        const isMin = item.quantity === 1;
        return `
            <li data-id="${item.id}">
                <span class="product-name">${escapeHtml(item.name)}</span>
                <div class="counter">
                    <button type="button" class="btn-minus${isMin ? " is-disabled" : ""}" aria-label="Зменшити кількість" data-tooltip="${isMin ? "Мінімальна кількість" : "Зменшити"}"> − </button>
                    <span class="amount">${item.quantity}</span>
                    <button type="button" class="btn-plus" aria-label="Збільшити кількість" data-tooltip="Збільшити"> + </button>
                </div>
                <button type="button" class="btn-buy" data-tooltip="Позначити як куплене">
                    Куплено
                </button>
                <button type="button" class="btn-delete" aria-label="Видалити товар" data-tooltip="Видалити"> × </button>
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
