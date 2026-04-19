// ===== STATE =====
let cart = {}; // { monAnId: { ten, gia, soLuong } }
let menuData = [];
let banId = null;
let banTen = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra đã chọn bàn chưa (lưu trong sessionStorage)
    const savedBanId = sessionStorage.getItem('datmon_banId');
    const savedBanTen = sessionStorage.getItem('datmon_banTen');

    if (savedBanId) {
        banId = parseInt(savedBanId);
        banTen = savedBanTen;
        showTableBadge(banTen);
        document.getElementById('table-overlay').classList.add('hidden');
    } else {
        // Chưa chọn bàn -> hiện overlay chọn bàn
        loadBanList();
    }

    loadMenu();
});

// ===== BÀN =====
async function loadBanList() {
    try {
        const res = await fetch('/api/customer/ban');
        const data = await res.json();
        const dsBan = data.result || [];

        const grid = document.getElementById('table-grid-picker');
        grid.innerHTML = '';

        if (dsBan.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center">Hiện không có bàn nào trong hệ thống.</p>';
            return;
        }

        dsBan.forEach(ban => {
            const btn = document.createElement('button');
            btn.className = 'table-pick-btn';
            const isTrong = ban.trangThai === 'TRONG';
            btn.innerHTML = `
                <span class="t-icon">${isTrong ? '🟢' : '🔴'}</span>
                ${ban.tenBan}
                <small style="display:block;font-weight:400;color:var(--text-muted);margin-top:4px;font-size:0.78rem">
                    ${isTrong ? 'Còn trống' : 'Đang có khách'}
                </small>`;
            btn.onclick = () => chonBan(ban.id, ban.tenBan);
            grid.appendChild(btn);
        });
    } catch (e) {
        console.error('Không lấy được danh sách bàn:', e);
    }
}

function chonBan(id, ten) {
    banId = id;
    banTen = ten;
    sessionStorage.setItem('datmon_banId', id);
    sessionStorage.setItem('datmon_banTen', ten);
    showTableBadge(ten);
    document.getElementById('table-overlay').classList.add('hidden');
}

function showTableBadge(ten) {
    const badge = document.getElementById('header-table-badge');
    badge.innerHTML = `<span class="table-dot"></span> ${ten}`;
    badge.style.display = 'flex';
}

// ===== MENU =====
async function loadMenu() {
    try {
        const res = await fetch('/api/customer/menu');
        const data = await res.json();
        menuData = data.result || [];
        renderMenu(menuData);
    } catch (e) {
        console.error('Không lấy được menu:', e);
        document.getElementById('menu-grid').innerHTML =
            '<p style="color:var(--text-muted)">Không thể tải menu. Vui lòng thử lại.</p>';
    }
}

function renderMenu(list) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted)">Không có món nào.</p>';
        return;
    }

    list.forEach(mon => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.id = `card-${mon.id}`;

        const isAvailable = mon.active !== false;
        const qtyInCart = cart[mon.id] ? cart[mon.id].soLuong : 0;

        card.innerHTML = `
            <div class="menu-card-img ${!mon.imageUrl ? 'no-img' : ''}">
                ${mon.imageUrl
                    ? `<img src="${mon.imageUrl}" alt="${mon.tenMon}" loading="lazy">`
                    : '🍽️'}
                ${!isAvailable ? '<div class="suspended-label">Tạm ngưng bán</div>' : ''}
            </div>
            <div class="menu-card-qty ${qtyInCart > 0 ? 'show' : ''}" id="qty-badge-${mon.id}">
                x${qtyInCart}
            </div>
            <div class="menu-card-body">
                <div class="menu-card-name">${mon.tenMon}</div>
                <div class="menu-card-price">${formatPrice(mon.gia)}</div>
            </div>
            ${isAvailable
                ? `<button class="menu-card-add" onclick="addToCart(${mon.id}, '${mon.tenMon.replace(/'/g, "\\'")}', ${mon.gia})">+</button>`
                : ''}`;
        grid.appendChild(card);
    });
}

// ===== GIỎ HÀNG =====
function addToCart(id, ten, gia) {
    if (!banId) {
        alert('Vui lòng chọn bàn trước khi đặt món!');
        return;
    }
    // Phòng vệ: kiểm tra món có đang bán không
    const monData = menuData.find(m => m.id === id);
    if (monData && monData.active === false) {
        showToast('Món ăn đang tạm ngưng bán, quý khách xin vui lòng chọn món khác nhé', false);
        return;
    }
    if (cart[id]) {
        if (cart[id].soLuong >= 30) {
            showToast('Chỉ được đặt tối đa 30 phần mỗi món!', false);
            return;
        }
        cart[id].soLuong++;
    } else {
        cart[id] = { ten, gia, soLuong: 1 };
    }
    updateCartUI();
    updateQtyBadge(id);
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].soLuong += delta;
    if (cart[id].soLuong <= 0) {
        delete cart[id];
    } else if (cart[id].soLuong > 30) {
        cart[id].soLuong = 30;
    }
    updateCartUI();
    updateQtyBadge(id);
}

function updateQtyBadge(id) {
    const badge = document.getElementById(`qty-badge-${id}`);
    if (!badge) return;
    const qty = cart[id] ? cart[id].soLuong : 0;
    badge.textContent = `x${qty}`;
    badge.classList.toggle('show', qty > 0);
}

function updateCartUI() {
    const keys = Object.keys(cart);
    const totalItems = keys.reduce((s, k) => s + cart[k].soLuong, 0);
    const total = keys.reduce((s, k) => s + cart[k].soLuong * cart[k].gia, 0);

    // Cập nhật số lượng ở nút mở giỏ
    document.getElementById('cart-count').textContent = totalItems;

    // Cập nhật tổng tiền
    document.getElementById('cart-total').textContent = formatPrice(total);

    // Render danh sách
    const container = document.getElementById('cart-items-list');
    if (keys.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon">🛒</span>
                <p>Giỏ hàng trống</p>
                <span style="font-size:0.82rem;color:var(--text-muted)">Chọn món để bắt đầu</span>
            </div>`;
    } else {
        container.innerHTML = keys.map(id => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${cart[id].ten}</div>
                    <div class="cart-item-price">${formatPrice(cart[id].gia)} / phần</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
                    <span class="qty-num">${cart[id].soLuong}</span>
                    <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
                </div>
            </div>`).join('');
    }

    // Enabled/disabled nút đặt món
    document.getElementById('submit-btn').disabled = keys.length === 0;
}

// ===== GIA DIỆN GIỎ =====
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const main = document.getElementById('order-main');
    const isOpen = sidebar.classList.toggle('open');
    main.classList.toggle('cart-open', isOpen);
}

// ===== GỬI ĐƠN =====
async function submitOrder() {
    if (!banId) {
        alert('Vui lòng chọn bàn trước!');
        return;
    }
    const keys = Object.keys(cart);
    if (keys.length === 0) {
        alert('Giỏ hàng đang trống!');
        return;
    }

    const payload = keys.map(id => ({
        monAnId: parseInt(id),
        soLuong: cart[id].soLuong
    }));

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Đang gửi đơn...';

    try {
        const res = await fetch(`/api/customer/order/${banId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.code === 1000) {
            // Xóa giỏ hàng sau khi đặt thành công
            cart = {};
            updateCartUI();
            // Cập nhật badge trên từng card
            menuData.forEach(m => updateQtyBadge(m.id));
            showToast('🎉 ' + data.message, true);
            // Đóng sidebar giỏ hàng
            document.getElementById('cart-sidebar').classList.remove('open');
            document.getElementById('order-main').classList.remove('cart-open');
        } else {
            showToast('Có lỗi xảy ra: ' + (data.message || 'Thử lại nhé!'), false);
        }
    } catch (e) {
        showToast('Mất kết nối đến máy chủ. Vui lòng thử lại!', false);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Xác nhận đặt món';
    }
}

// ===== TOAST =====
function showToast(msg, success = true) {
    const toast = document.getElementById('toast');
    toast.innerHTML = success
        ? `<span class="t-check">✓</span> ${msg}`
        : `<span class="t-check" style="color:#e05c5c">✗</span> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== UTILITY =====
function formatPrice(n) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}
