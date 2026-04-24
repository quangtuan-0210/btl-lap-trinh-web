/* =====================================================
   admin.js  –  Restaurant POS Admin SPA
   Gọi REST API backend:
     POST   /api/auth/login
     POST   /api/auth/logout
     GET    /api/admin/menu
     POST   /api/admin/menu
     DELETE /api/admin/menu/{id}
     GET    /api/nhan-vien
     POST   /api/nhan-vien
     PUT    /api/nhan-vien/{id}
     DELETE /api/nhan-vien/{id}
     GET    /api/pos/ban
     GET    /api/pos/hoa-don        (lịch sử)
     GET    /api/pos/hoa-don/{id}   (chi tiết)
===================================================== */

'use strict';

/* STATE */
const state = {
    user    : null,
    monAn   : [],
    nhanVien: [],
    hoaDon  : [],
    hdPage  : 0,
    hdSize  : 10,

    monAnPage: 0,
    monAnSize: 20
};

/*Khởi tạo*/
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra session
    const saved = sessionStorage.getItem('posUser');
    if (!saved) { window.location.href = '/login'; return; }

    state.user = JSON.parse(saved);
    renderUserInfo();
    loadDashboard();
});

function renderUserInfo() {
    const u = state.user;
    if (!u) return;
    const initial = (u.username || u.email || 'A')[0].toUpperCase();
    document.getElementById('userAvatar').textContent      = initial;
    document.getElementById('userNameDisplay').textContent = u.username || u.email || 'Admin';
    document.getElementById('userRoleDisplay').textContent = u.role === 'ADMIN' ? 'Quản trị viên' : 'Thu ngân';
    document.getElementById('sidebarRole').textContent     = u.role || 'Admin';
}

/* NAVIGATION */
const PAGE_META = {
    dashboard: { title: 'Dashboard',           crumb: 'Tổng quan hệ thống',       load: loadDashboard   },
    monan    : { title: 'Quản lý món ăn',      crumb: 'Thêm / sửa / xóa món ăn', load: loadMonAn       },
    nhanvien : { title: 'Quản lý nhân viên',   crumb: 'Thêm / sửa / xóa nhân viên', load: loadNhanVien },
    hoadon   : { title: 'Lịch sử hóa đơn',    crumb: 'Tra cứu & xem chi tiết',   load: loadHoaDon      },
};

function switchPage(name, el) {
    // Ẩn tất cả page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Hiện page được chọn
    document.getElementById('page-' + name).classList.add('active');
    if (el) el.classList.add('active');

    const meta = PAGE_META[name];
    if (meta) {
        document.getElementById('pageTitle').textContent      = meta.title;
        document.getElementById('pageBreadcrumb').textContent = meta.crumb;
        meta.load();
    }
}

/* DASHBOARD */
async function loadDashboard() {
    await Promise.all([loadMonAnForDash(), loadNhanVienForDash(), loadHoaDonForDash()]);
}

async function loadMonAnForDash() {
    // vẫn lấy tổng số món ăn cho card
    const allFoods = await apiFetch('/api/admin/menu');
    state.monAn = allFoods || [];
    document.getElementById('statMonAn').textContent = state.monAn.length;

    // gọi API top 5 món bán chạy
    const list = await apiFetch('/api/admin/menu/top-5');

    const body = document.getElementById('dashMonAnBody');

    const rows = (list || []).map((m, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${esc(m[0])}</td>
            <td>${m[1]} lượt</td>
            <td><span class="badge badge-success">🔥 Bán chạy</span></td>
        </tr>
    `).join('');

    body.innerHTML = rows || emptyRow(4);
}

async function loadNhanVienForDash() {
    const list = await apiFetch('/api/nhan-vien');
    state.nhanVien = list || [];
    document.getElementById('statNhanVien').textContent = state.nhanVien.length;
}

async function loadHoaDonForDash() {
    const list = await apiFetch('/api/pos/hoa-don');
    const all  = list || [];
    // Hóa đơn đã thanh toán hôm nay
    const today = new Date().toDateString();
    const hd    = all.filter(h => h.thoiDiemThanhToan && new Date(h.thoiDiemThanhToan).toDateString() === today);
    const total = hd.reduce((s, h) => s + (h.tongTien || 0), 0);
    document.getElementById('statHoaDon').textContent   = hd.length;
    document.getElementById('statDoanhThu').textContent = fmtVnd(total);
}

/* MÓN ĂN */
async function loadMonAn() {
    const list = await apiFetch('/api/admin/menu');
    state.monAn = list || [];
    state.monAnPage = 0;
    renderMonAnTable();
}

function renderMonAnTable(data = null) {
    const body = document.getElementById('monAnBody');
    const source = data || state.monAn;

    if (!source.length) {
        body.innerHTML = emptyRow(5);
        renderMonAnPagination(source);
        return;
    }

    const start = state.monAnPage * state.monAnSize;
    const paged = source.slice(start, start + state.monAnSize);

    body.innerHTML = paged.map((m, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td>${esc(m.tenMon)}</td>
            <td>${fmtVnd(m.gia)}</td>
            <td>${badgeActive(m.active)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editMonAn(${m.id})">✏️ Sửa</button>
                <button class="btn-action btn-del" onclick="confirmDeleteMonAn(${m.id}, '${esc(m.tenMon)}')">🗑 Xóa</button>
            </td>
        </tr>
    `).join('');

    renderMonAnPagination(source);
}
function renderMonAnPagination(data = null) {
    const source = data || state.monAn;
    const totalPages = Math.ceil(source.length / state.monAnSize);
    const pg = document.getElementById('monAnPagination');

    if (!pg) return;

    if (totalPages <= 1) {
        pg.innerHTML = '';
        return;
    }

    let html = '';

    for (let i = 0; i < totalPages; i++) {
        html += `
            <button class="page-btn ${i === state.monAnPage ? 'active' : ''}"
                onclick="goMonAnPage(${i})">
                ${i + 1}
            </button>
        `;
    }

    pg.innerHTML = html;
}

function goMonAnPage(page) {
    state.monAnPage = page;
    renderMonAnTable();
}

function filterMonAn() {
    const q = document.getElementById('searchMonAn').value.toLowerCase();

    const data = state.monAn.filter(m =>
        m.tenMon.toLowerCase().includes(q) ||
        String(m.id).includes(q)
    );

    state.monAnPage = 0;
    renderMonAnTable(data);
}

function openMonAnModal(mon = null) {
    document.getElementById('monAnId').value = mon ? mon.id : '';
    document.getElementById('tenMon').value = mon ? mon.tenMon : '';
    document.getElementById('gia').value = mon ? mon.gia : '';
    document.getElementById('imageUrl').value = mon ? (mon.imageUrl || '') : '';
    document.getElementById('monAnActive').value = mon ? String(mon.active) : 'true';

    document.getElementById('category').value =
        mon ? (mon.category || 'COM') : 'COM';

    document.getElementById('modalMonAnTitle').textContent =
        mon ? 'Cập nhật món ăn' : 'Thêm món ăn';

    openModal('modalMonAn');
}
function editMonAn(id) {
    const mon = state.monAn.find(m => m.id === id);
    if (mon) openMonAnModal(mon);
}

async function submitMonAn() {
    const id     = document.getElementById('monAnId').value;
    const tenMon = document.getElementById('tenMon').value.trim();
    const gia    = parseFloat(document.getElementById('gia').value);
    const active = document.getElementById('monAnActive').value === 'true';
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const category = document.getElementById('category').value;

    if (!tenMon || isNaN(gia) || gia < 0) {
        toast('Vui lòng điền đầy đủ thông tin hợp lệ.', 'error'); return;
    }

    const body = { tenMon, gia, active, imageUrl, category };

    try {
        if (id) {
            await apiFetch(`/api/admin/menu/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
            toast('Cập nhật món ăn thành công!', 'success');
        } else {
            await apiPost('/api/admin/menu', body);
            toast('Thêm món ăn thành công!', 'success');
        }
        closeModal('modalMonAn');
        await loadMonAn();
    } catch (e) {
        toast('Lỗi: ' + (e.message || 'Vui lòng thử lại.'), 'error');
    }
}

function confirmDeleteMonAn(id, name) {
    document.getElementById('deleteMsg').textContent = `Bạn có chắc muốn xóa món "${name}"?`;
    document.getElementById('btnConfirmDelete').onclick = async () => {
        try {
            await apiFetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
            toast('Đã xóa món ăn.', 'success');
            closeModal('modalDelete');
            await loadMonAn();
        } catch (e) {
            toast('Xóa thất bại: ' + e.message, 'error');
        }
    };
    openModal('modalDelete');
}

/* NHÂN VIÊN */
async function loadNhanVien() {
    try {
        const list = await apiFetch('/api/nhan-vien');
        console.log("Danh sách nhân viên:", list);

        state.nhanVien = list || [];
        renderNhanVienTable(state.nhanVien);
    } catch (e) {
        console.error("Lỗi load nhân viên:", e);
        toast("Không thể tải danh sách nhân viên", "error");
    }
}

function renderNhanVienTable(data) {
    const body = document.getElementById('nhanVienBody');

    if (!data.length) {
        body.innerHTML = emptyRow(5);
        return;
    }

    body.innerHTML = data.map((nv, index) => `
    <tr>
        <td>${index + 1}</td>
        <td><strong>${esc(nv.username)}</strong></td>
        <td>${esc(nv.email)}</td>
        <td>${badgeRole(nv.role)}</td>
        <td>
            <button class="btn-action btn-edit" onclick="editNhanVien(${nv.id})">✏️ Sửa</button>
            <button class="btn-action btn-del" onclick="confirmDeleteNhanVien(${nv.id}, '${esc(nv.username)}')">🗑 Xóa</button>
        </td>
    </tr>
`).join('');
}

function filterNhanVien() {
    const q = document.getElementById('searchNhanVien').value.toLowerCase();

    const data = state.nhanVien.filter(nv =>
        nv.username.toLowerCase().includes(q) ||
        nv.email.toLowerCase().includes(q) ||
        (nv.role || '').toLowerCase().includes(q)
    );

    renderNhanVienTable(data);
}

function openNhanVienModal(nv = null) {
    document.getElementById('nhanVienId').value = nv ? nv.id : '';
    document.getElementById('nvUsername').value = nv ? nv.username : '';
    document.getElementById('nvEmail').value = nv ? nv.email : '';
    document.getElementById('nvPassword').value = '';
    document.getElementById('nvRole').value = nv ? (nv.role || 'STAFF') : 'STAFF';

    document.getElementById('nvPasswordGroup').style.display = nv ? 'none' : 'block';
    document.getElementById('modalNhanVienTitle').textContent =
        nv ? 'Cập nhật nhân viên' : 'Thêm nhân viên';

    openModal('modalNhanVien');
}

function editNhanVien(id) {
    const nv = state.nhanVien.find(n => n.id === id);
    if (nv) openNhanVienModal(nv);
}

async function submitNhanVien() {
    const id = document.getElementById('nhanVienId').value;
    const username = document.getElementById('nvUsername').value.trim();
    const email = document.getElementById('nvEmail').value.trim();
    const password = document.getElementById('nvPassword').value.trim();

    if (!username || !email) {
        toast('Vui lòng nhập username và email.', 'error');
        return;
    }

    if (!id && !password) {
        toast('Vui lòng nhập mật khẩu.', 'error');
        return;
    }

    const body = {
        username,
        email,
        password,
        role: "STAFF"
    };

    try {
        if (id) {
            await apiFetch(`/api/nhan-vien/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            toast('Cập nhật nhân viên thành công!', 'success');
        } else {
            await apiPost('/api/nhan-vien', body);
            toast('Thêm nhân viên thành công!', 'success');
        }

        closeModal('modalNhanVien');
        await loadNhanVien();
    } catch (e) {
        toast('Lỗi: ' + e.message, 'error');
    }
}

function confirmDeleteNhanVien(id, name) {
    document.getElementById('deleteMsg').textContent =
        `Bạn có chắc muốn xóa nhân viên "${name}"?`;

    document.getElementById('btnConfirmDelete').onclick = async () => {
        try {
            await apiFetch(`/api/nhan-vien/${id}`, {
                method: 'DELETE'
            });

            toast('Đã xóa nhân viên.', 'success');
            closeModal('modalDelete');
            await loadNhanVien();
        } catch (e) {
            toast('Xóa thất bại: ' + e.message, 'error');
        }
    };

    openModal('modalDelete');
}

/* HÓA ĐƠN */
async function loadHoaDon() {
    const dateVal = document.getElementById('filterDate').value;
    let url       = '/api/pos/hoa-don';
    if (dateVal) url += `?date=${dateVal}`;

    const list   = await apiFetch(url);
    console.log("Hoa don:", list);
    state.hoaDon = list || [];
    state.hdPage = 0;
    renderHoaDonTable();
}

function clearDateFilter() {
    document.getElementById('filterDate').value = '';
    loadHoaDon();
}

function renderHoaDonTable() {
    const body = document.getElementById('hoaDonBody');
    const data = state.hoaDon;

    if (!data.length) {
        body.innerHTML = emptyRow(7);
        renderHdPagination();
        return;
    }

    const start = state.hdPage * state.hdSize;
    const paged = data.slice(start, start + state.hdSize);

    body.innerHTML = paged.map(h => `
        <tr>
            <td><strong>#${h.id}</strong></td>
            <td>${h.ban ? h.ban.tenBan : '--'}</td>
            <td>${fmtDatetime(h.thoiDiemMo)}</td>
            <td>${h.thoiDiemThanhToan ? fmtDatetime(h.thoiDiemThanhToan) : '--'}</td>
            <td><strong>${fmtVnd(h.tongTien || 0)}</strong></td>
            <td>${badgeHdStatus(h.trangThai)}</td>
            <td>
                <button class="btn-action btn-view" onclick="xemChiTiet(${h.id})">🔍 Xem</button>
            </td>
        </tr>
    `).join('');

    renderHdPagination();
}

function renderHdPagination() {
    const total = Math.ceil(state.hoaDon.length / state.hdSize);
    const pg    = document.getElementById('hdPagination');
    if (total <= 1) { pg.innerHTML = ''; return; }

    let html = '';
    for (let i = 0; i < total; i++) {
        html += `<button class="page-btn ${i === state.hdPage ? 'active' : ''}" onclick="hdGoPage(${i})">${i + 1}</button>`;
    }
    pg.innerHTML = html;
}

function hdGoPage(p) { state.hdPage = p; renderHoaDonTable(); }

async function xemChiTiet(id) {
    const detail = document.getElementById('hoaDonDetail');
    detail.innerHTML = 'Đang tải...';
    openModal('modalHoaDon');

    try {
        const ds = await apiFetch(`/api/pos/hoa-don/${id}`);

        const items = ds.map(ct => `
            <tr>
                <td>${esc(ct.monAn?.tenMon || '--')}</td>
                <td>${ct.soLuong}</td>
                <td>${fmtVnd(ct.donGia)}</td>
                <td>${fmtVnd(ct.soLuong * ct.donGia)}</td>
            </tr>
        `).join('');

        const tong = ds.reduce((s, ct) => s + ct.soLuong * ct.donGia, 0);

        detail.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Tên món</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>${items}</tbody>
            </table>
            <div class="invoice-total">Tổng: ${fmtVnd(tong)}</div>
        `;
    } catch (e) {
        detail.innerHTML = `<p>Lỗi: ${e.message}</p>`;
    }
}

/* LOGOUT */
async function doLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    sessionStorage.removeItem('posUser');
    window.location.href = '/login';
}

/* MODAL HELPERS */
function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

// Đóng modal khi click overlay
document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
        if (e.target === el) el.classList.remove('show');
    });
});

/* TOAST */
function toast(msg, type = 'info') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const t     = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

/* API HELPERS */
async function apiFetch(url, options = {}) {
    // Lấy thẻ JWT từ túi ra
    const user = JSON.parse(sessionStorage.getItem('posUser'));
    const token = user ? user.token : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Đính kèm thẻ vào Header
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });

    // Nếu bị đuổi (hết hạn thẻ / sai quyền)
    if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc bạn không có quyền!");
        sessionStorage.removeItem('posUser');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
    }

    // Tự động bóc lớp vỏ result của Backend
    return data?.result !== undefined ? data.result : data;
}

async function apiPost(url, body) {
    return apiFetch(url, {
        method : 'POST',
        body   : JSON.stringify(body)
    });
}

/* FORMAT HELPERS */
function fmtVnd(n) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);
}

function fmtDatetime(str) {
    if (!str) return '--';
    const d = new Date(str);
    return d.toLocaleString('vi-VN', { hour12: false });
}

function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function emptyRow(cols) {
    return `<tr><td colspan="${cols}"><div class="empty-state"><div>📭</div>Không có dữ liệu</div></td></tr>`;
}

function badgeActive(active) {
    return active !== false
        ? '<span class="badge badge-success">Hoạt động</span>'
        : '<span class="badge badge-danger">Tạm dừng</span>';
}

function badgeRole(role) {
    const map = {
        ADMIN: 'badge-info',
        STAFF: 'badge-warning',
    };

    return `<span class="badge ${map[role] || 'badge-gray'}">${role || '--'}</span>`;
}

function badgeHdStatus(status) {
    const map = {
        DA_THANH_TOAN: ['badge-success', 'Đã thanh toán'],
        CHUA_THANH_TOAN: ['badge-warning', 'Chưa thanh toán']
    };

    const [cls, label] = map[status] || ['badge-gray', status || '--'];
    return `<span class="badge ${cls}">${label}</span>`;
}
let revenueChart;

async function loadRevenueChart() {
    const type = document.getElementById("chartType").value;

    const all = await apiFetch('/api/pos/hoa-don');
    const hoaDon = all || [];

    let labels = [];
    let values = [];

    if (type === "week") {
        labels = [];
        values = [];

        const today = new Date();
        const revenueMap = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            const key = d.toISOString().split("T")[0];
            revenueMap[key] = 0;

            const thu = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()];
            labels.push(thu);
        }

        hoaDon.forEach(hd => {
            if (!hd.thoiDiemThanhToan) return;

            const d = new Date(hd.thoiDiemThanhToan);
            const key = d.toISOString().split("T")[0];

            if (revenueMap.hasOwnProperty(key)) {
                revenueMap[key] += hd.tongTien || 0;
            }
        });

        values = Object.values(revenueMap);
    }

    if (type === "month") {
        labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
        values = [0, 0, 0, 0];

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        hoaDon.forEach(hd => {
            if (!hd.thoiDiemThanhToan) return;

            const d = new Date(hd.thoiDiemThanhToan);

            if (d.getMonth() === month && d.getFullYear() === year) {
                const week = Math.min(3, Math.floor((d.getDate() - 1) / 7));
                values[week] += hd.tongTien || 0;
            }
        });
    }

    const ctx = document.getElementById("revenueChart");

    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Doanh thu",
                data: values,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}