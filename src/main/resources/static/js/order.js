// STATE
let cart = {}; // { id: { ten, gia, soLuong } }
let menuData = [];
let banId = null;
let banTen = null;

// INIT
document.addEventListener('DOMContentLoaded', () => {
    const savedBanId = sessionStorage.getItem('datmon_banId');
    const savedBanTen = sessionStorage.getItem('datmon_banTen');

    if (savedBanId) {
        banId = parseInt(savedBanId);
        banTen = savedBanTen;
        showTableBadge(banTen);
        document.getElementById('table-overlay')?.classList.add('hidden');
    } else {
        loadBanList();
    }

    loadMenu();

    document.getElementById('category-filter')?.addEventListener('change', applyFilters);
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
});

// BÀN
async function loadBanList() {
    try {
        const res = await fetch('/api/customer/ban');
        const data = await res.json();
        const dsBan = data.result || [];

        const grid = document.getElementById('table-grid-picker');
        grid.innerHTML = '';

        dsBan.forEach(ban => {
            const btn = document.createElement('button');
            btn.className = 'table-pick-btn';

            btn.innerHTML = `
                <span>${ban.tenBan}</span>
            `;

            btn.onclick = () => chonBan(ban.id, ban.tenBan);
            grid.appendChild(btn);
        });
    } catch (e) {
        console.error('Lỗi load bàn:', e);
    }
}

function chonBan(id, ten) {
    banId = id;
    banTen = ten;

    sessionStorage.setItem('datmon_banId', id);
    sessionStorage.setItem('datmon_banTen', ten);

    showTableBadge(ten);
    document.getElementById('table-overlay')?.classList.add('hidden');
}

// HEADER BÀN
function showTableBadge(ten) {
    const badge = document.getElementById('header-table-badge');

    badge.innerHTML = `
        <div class="table-badge-content" onclick="toggleTableMenu()">
            <span class="table-dot"></span> ${ten}
            <span>▾</span>
        </div>

        <div class="table-dropdown" id="table-dropdown">
            <div class="dropdown-item danger" onclick="leaveTable()">❌ Thoát bàn</div>
        </div>
    `;

    badge.style.display = 'flex';
}

function toggleTableMenu() {
    document.getElementById('table-dropdown')?.classList.toggle('show');
}

function changeTable() {
    sessionStorage.clear();

    banId = null;
    banTen = null;

    document.getElementById('table-overlay')?.classList.remove('hidden');
    loadBanList();

    document.getElementById('table-dropdown')?.classList.remove('show');
}

function leaveTable() {
    sessionStorage.clear();

    banId = null;
    banTen = null;

    cart = {};
    updateCartUI();

    document.getElementById('header-table-badge').style.display = 'none';
    document.getElementById('table-overlay')?.classList.remove('hidden');

    loadBanList();
}

// click ngoài đóng dropdown
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('table-dropdown');
    const badge = document.getElementById('header-table-badge');

    if (dropdown && badge && !badge.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// MENU
async function loadMenu() {
    try {
        const res = await fetch('/api/customer/menu');
        const data = await res.json();
        menuData = data.result || [];
        applyFilters();
    } catch (e) {
        console.error('Lỗi load menu:', e);
    }
}

function applyFilters() {
    const category = document.getElementById('category-filter')?.value || '';
    const keyword = document.getElementById('search-input')?.value.toLowerCase() || '';

    const filtered = menuData.filter(mon => {
        const matchCategory =
            category === '' ||
            mon.loaiMon?.tenLoai === category ||
            mon.loaiMon?.id == category ||
            mon.category == category;

        const matchKeyword =
            keyword === '' ||
            mon.tenMon?.toLowerCase().includes(keyword);

        return matchCategory && matchKeyword;
    });

    renderMenu(filtered);
}

function renderMenu(list) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-muted)">Không có món</p>`;
        return;
    }

    list.forEach(mon => {
        const qty = cart[mon.id]?.soLuong || 0;

        const card = document.createElement('div');
        card.className = 'menu-card';

        card.innerHTML = `
            <div class="menu-card-img ${!mon.imageUrl ? 'no-img' : ''}">
                ${mon.imageUrl
                    ? `<img src="${mon.imageUrl}" alt="${mon.tenMon}">`
                    : '🍽️'}
            </div>

            <div class="menu-card-body">
                <div class="menu-card-name">${mon.tenMon}</div>
                <div class="menu-card-price">${formatPrice(mon.gia)}</div>
            </div>

            <button class="menu-card-add"
                onclick="addToCart(${mon.id}, '${mon.tenMon.replace(/'/g, "\\'")}', ${mon.gia})">+</button>

            <div class="menu-card-qty ${qty > 0 ? 'show' : ''}" id="qty-badge-${mon.id}">
                x${qty}
            </div>
        `;

        grid.appendChild(card);
    });
}

// CART
function addToCart(id, ten, gia) {
    if (!banId) {
        alert('Vui lòng chọn bàn trước!');
        return;
    }

    if (cart[id]) cart[id].soLuong++;
    else cart[id] = { ten, gia, soLuong: 1 };

    updateCartUI();
    updateQtyBadge(id);
}

function changeQty(id, delta) {
    if (!cart[id]) return;

    cart[id].soLuong += delta;
    if (cart[id].soLuong <= 0) delete cart[id];

    updateCartUI();
    updateQtyBadge(id);
}

function updateQtyBadge(id) {
    const el = document.getElementById(`qty-badge-${id}`);
    if (!el) return;

    const qty = cart[id]?.soLuong || 0;
    el.textContent = `x${qty}`;
    el.classList.toggle('show', qty > 0);
}

// GIỎ HÀNG
function updateCartUI() {
    const keys = Object.keys(cart);

    const totalItems = keys.reduce((s, k) => s + cart[k].soLuong, 0);
    const total = keys.reduce((s, k) => s + cart[k].gia * cart[k].soLuong, 0);

    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-total').textContent = formatPrice(total);

    const container = document.getElementById('cart-items-list');

    if (keys.length === 0) {
        container.innerHTML = `<p>Giỏ hàng trống</p>`;
    } else {
        container.innerHTML = keys.map(id => `
            <div class="cart-item">
                <div>${cart[id].ten}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
                    <span class="qty-num">${cart[id].soLuong}</span>
                    <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    const btn = document.getElementById('submit-btn');
    if (btn) btn.disabled = keys.length === 0;
}

// CART UI
function toggleCart() {
    document.getElementById('cart-sidebar')?.classList.toggle('open');
}

// SUBMIT
async function submitOrder() {
    if (!banId) {
        alert('Chưa chọn bàn');
        return;
    }

    const keys = Object.keys(cart);
    if (keys.length === 0) {
        alert('Giỏ hàng trống');
        return;
    }

    const payload = keys.map(id => ({
        monAnId: parseInt(id),
        soLuong: cart[id].soLuong
    }));

    try {
        await fetch(`/api/customer/order/${banId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        cart = {};
        updateCartUI();
        applyFilters();

        alert('Đặt món thành công');
    } catch (e) {
        alert('Lỗi gửi đơn');
    }
}

// UTIL
function formatPrice(n) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(n);
}