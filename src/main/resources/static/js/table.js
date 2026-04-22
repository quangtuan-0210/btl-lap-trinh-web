async function apiFetch(url, options = {}) {
    const user = JSON.parse(sessionStorage.getItem('posUser'));
    const token = user ? user.token : null;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc bạn không có quyền!");
        sessionStorage.removeItem('posUser');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
    return data?.result !== undefined ? data.result : data;
}

let currentTableId = null;
let currentHoaDonId = null;
let isOpeningTable = false;

// Load ds bàn
async function loadTables() {
    try {
        const tables = await apiFetch('/api/pos/ban');
        const grid = document.getElementById('table-grid');
        grid.innerHTML = '';

        (tables || []).forEach(t => {
            const div = document.createElement('div');
            div.className = `table-card ${t.trangThai === 'CO_KHACH' ? 'status-occupied' : 'status-empty'}`;
            div.innerText = t.tenBan;

            div.onclick = async () => {
                if (isOpeningTable)
                    return;
                isOpeningTable = true;
                currentTableId = t.id;
                currentHoaDonId = null;

                document.getElementById('current-table-name').innerText = t.tenBan;
                renderBill([]);

                try {
                    const result = await apiFetch(`/api/pos/mo-ban/${t.id}`, { method: 'POST' });
                    if (result) {
                        currentHoaDonId = result.id;
                        if (t.trangThai === 'CO_KHACH') {
                            await loadBillFromServer();
                        }
                    }
                } catch (e) {
                    console.error("Lỗi:", e);
                } finally {
                    isOpeningTable = false;
                }
            };
            grid.appendChild(div);
        });
    } catch (e) {
        console.error("Lỗi load bàn", e);
    }
}

// Load bill
async function loadBillFromServer() {
    if (!currentHoaDonId)
        return;
    try {
        const result = await apiFetch(`/api/pos/hoa-don/${currentHoaDonId}`);
        renderBill(result || []);
    } catch (e) {
        console.error("Lỗi load hóa đơn", e);
    }
}

// Thêm món
async function addToBill(product) {
    if (isOpeningTable || !currentHoaDonId) {
        alert("Vui lòng chọn bàn trước!");
        return;
    }
    try {
        await apiFetch('/api/pos/goi-mon', {
            method: 'POST',
            body: JSON.stringify({
                hoaDonId: currentHoaDonId,
                monAnId: product.id,
                soLuong: 1
            })
        });
        await loadBillFromServer();
        await loadTables();
    } catch (e) {
        alert("Lỗi thêm món!");
    }
}

// Giảm/ xóa món
async function changeQuantity(cthdId, newQuantity) {
    if (newQuantity <= 0) {
        await removeItem(cthdId);
        return;
    }
    try {
        await apiFetch('/api/pos/cap-nhat-so-luong', {
            method: 'POST',
            body: JSON.stringify({ cthdId: cthdId, soLuong: newQuantity })
        });
        await loadBillFromServer();
    } catch (e) {
        console.error(e);
    }
}

async function removeItem(cthdId) {
    if (!confirm("Bạn muốn xóa món này?")) return;
    try {
        await apiFetch(`/api/pos/xoa-mon/${cthdId}`, { method: 'DELETE' });
        await loadBillFromServer();
        await loadTables();
    } catch(e) {
        alert("Lỗi xóa món");
    }
}

// Lập hóa đơn
function renderBill(items) {
    const body = document.getElementById('bill-items-body');
    let total = 0;
    body.innerHTML = '';

    if (!items || items.length === 0) {
        document.getElementById('total-price').innerText = '0đ';
        return;
    }

    items.forEach(item => {
        const tenMon = item.monAn ? item.monAn.tenMon : 'Không xác định';
        const thanhTien = item.soLuong * item.donGia;
        total += thanhTien;

        body.innerHTML += `
            <tr>
                <td style="font-weight: 500; color: #333;">${tenMon}</td>
                <td>
                    <div class="qty-control">
                        <button class="btn-qty" onclick="changeQuantity(${item.id}, ${item.soLuong - 1})">−</button>
                        <span class="qty-num">${item.soLuong}</span>
                        <button class="btn-qty" onclick="changeQuantity(${item.id}, ${item.soLuong + 1})">+</button>
                    </div>
                </td>
                <td style="color: #666;">${item.donGia.toLocaleString()}đ</td>
                <td style="font-weight: 600; color: #333;">${thanhTien.toLocaleString()}đ</td>
                <td>
                    <button class="btn-del" onclick="removeItem(${item.id})">Xóa</button>
                </td>
            </tr>`;
    });
    document.getElementById('total-price').innerText = total.toLocaleString() + 'đ';
}

//Thanh toán
async function handlePayment() {
    if (!currentHoaDonId || isOpeningTable)
        return;
    if (!confirm("Xác nhận thanh toán?"))
        return;
    try {
        await apiFetch(`/api/pos/thanh-toan/${currentHoaDonId}`, { method: 'POST' });
        alert("Thanh toán xong!");
        currentHoaDonId = null;
        renderBill([]);
        await loadTables();
    } catch (e) {
        alert("Lỗi thanh toán");
    }
}