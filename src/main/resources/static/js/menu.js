async function loadMenu() {
    try {
        // Dùng apiFetch thay cho fetch
        const products = await apiFetch('/api/admin/menu');

        const grid = document.getElementById('menu-grid');
        grid.innerHTML = '';

        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'food-card';

            div.innerHTML = `
                <img src="${p.hinhAnh || ''}">
                <p>${p.tenMon}</p>
                <small>${p.gia.toLocaleString()}đ</small>
            `;

            div.onclick = () => {
                // Đảm bảo bạn đã có hàm addToBill() trong các file của bạn nhé
                if(typeof addToBill === 'function') {
                    addToBill({
                        id: p.id,
                        name: p.tenMon,
                        price: p.gia
                    });
                } else {
                    console.error("Hàm addToBill chưa được định nghĩa!");
                }
            };

            grid.appendChild(div);
        });
    } catch (error) {
        console.error("Lỗi khi tải menu món ăn:", error);
    }
}