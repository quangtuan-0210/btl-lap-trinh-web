'use strict';
async function loadMenu() {
    try {
        const category = document.getElementById('category-filter')?.value || '';
        const keyword = document.getElementById('search-input')?.value || '';

        let url = '/api/admin/menu';

        if (category) url += `category=${category}&`;
        if (keyword) url += `keyword=${keyword}`;

        // Gọi apiFetch (nó lấy chung hàm đã khai báo bên table.js)
        const products = await apiFetch(url) || [];

        const grid = document.getElementById('menu-grid');
        grid.innerHTML = '';

        products
            .filter(p => p.active === true)
            .forEach(p => {
                const div = document.createElement('div');
                div.className = 'food-card';

                div.innerHTML = `
                    <img src="${p.imageUrl || ''}">
                    <p>${p.tenMon}</p>
                    <small>${p.gia.toLocaleString()}đ</small>
                `;

                div.onclick = () => addToBill({
                    id: p.id,
                    name: p.tenMon,
                    price: p.gia
                });

                grid.appendChild(div);
            });

    } catch (e) {
        console.error("Lỗi load menu:", e);
    }
}

/* ===== EVENT FILTER ===== */
document.addEventListener("DOMContentLoaded", () => {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', loadMenu);
    }

    if (searchInput) {
        searchInput.addEventListener('input', loadMenu);
    }
});