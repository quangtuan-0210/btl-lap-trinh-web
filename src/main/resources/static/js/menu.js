'use strict';
async function loadMenu() {
    try {
        const category = document.getElementById('category-filter')?.value || '';
        const keyword = document.getElementById('search-input')?.value.toLowerCase() || '';

        // SỬA Ở ĐÂY: Gọi đúng API menu của Backend
        let url = '/api/admin/menu';

        // Gọi apiFetch (nó lấy chung hàm đã khai báo bên table.js)
        const products = await apiFetch(url) || [];

        const grid = document.getElementById('menu-grid');
        grid.innerHTML = '';

        products
            .filter(p => p.active === true) // 1. Chỉ hiển thị món đang bán
            .filter(p => category === '' || p.category === category) // 2. Lọc theo Loại món (Cơm, Bún...)
            .filter(p => keyword === '' || p.tenMon.toLowerCase().includes(keyword)) // 3. Lọc theo Tên món gõ vào
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