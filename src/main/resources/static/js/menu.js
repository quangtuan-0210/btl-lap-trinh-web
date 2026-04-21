'use strict';
async function loadMenu() {
    try {
        const category = document.getElementById('category-filter')?.value || '';
        const keyword = document.getElementById('search-input')?.value.toLowerCase() || '';

        let url = '/api/admin/menu';

        const products = await apiFetch(url) || [];

        const grid = document.getElementById('menu-grid');
        grid.innerHTML = '';

        products
            .filter(p => p.active === true) // đang bán
            .filter(p => category === '' || p.category === category) // Lọc
            .filter(p => keyword === '' || p.tenMon.toLowerCase().includes(keyword)) // Lọc gõ
            .forEach(p => {
                const div = document.createElement('div');
                div.className = 'food-card';

                div.innerHTML = `
                    <img src="${p.imageUrl || ''}" onerror="this.src='https://via.placeholder.com/150'">
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

/* EVENT FILTER */
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