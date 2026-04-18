DROP DATABASE IF EXISTS restaurant_db;
CREATE DATABASE restaurant_db;
USE restaurant_db;

-- ==========================================
-- 1. TẠO CÁC BẢNG DỮ LIỆU
-- ==========================================
CREATE TABLE ban (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_ban VARCHAR(255),
    trang_thai VARCHAR(50) DEFAULT 'TRONG'
);

CREATE TABLE mon_an (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_mon VARCHAR(255),
    gia DOUBLE,
    active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(1000),
    category VARCHAR(50)
);

CREATE TABLE nguoi_dung (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE hoa_don (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ban_id BIGINT,
    thoi_diem_mo DATETIME,
    thoi_diem_thanh_toan DATETIME,
    trang_thai VARCHAR(50),
    tong_tien DOUBLE,
    FOREIGN KEY (ban_id) REFERENCES ban(id)
);

CREATE TABLE cthd (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hoa_don_id BIGINT,
    mon_an_id BIGINT,
    so_luong INT,
    don_gia DOUBLE,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id),
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id)
);

-- ==========================================
-- 2. THÊM DỮ LIỆU (BÀN, NGƯỜI DÙNG)
-- ==========================================
INSERT INTO ban (ten_ban, trang_thai) VALUES
('Bàn số 1', 'TRONG'), ('Bàn số 2', 'TRONG'), ('Bàn số 3', 'TRONG'), ('Bàn số 4', 'TRONG'), ('Bàn số 5', 'TRONG'),
('Bàn số 6', 'TRONG'), ('Bàn số 7', 'TRONG'), ('Bàn số 8', 'TRONG'), ('Bàn số 9', 'TRONG'), ('Bàn số 10', 'TRONG');

INSERT INTO nguoi_dung (username, email, password, role) VALUES
('admin1', 'admin1@gmail.com', '123456', 'ADMIN'),
('admin2', 'admin2@gmail.com', '123456', 'ADMIN'),
('staff1', 'staff1@gmail.com', '123456', 'STAFF'),
('staff2', 'staff2@gmail.com', '123456', 'STAFF'),
('staff3', 'staff3@gmail.com', '123456', 'STAFF');

-- ==========================================
-- 3. THÊM DỮ LIỆU MÓN ĂN
-- ==========================================
INSERT INTO mon_an (ten_mon, gia, active) VALUES
('cơm rang',30000,1), ('phở bò',40000,1), ('bún chả',45000,1), ('Trà đá',5000,1), ('coca',15000,1),
('Bia Hà Nội',20000,1), ('Bò lúc lắc',120000,1), ('Gà nướng mật ong',90000,1), ('Cá hồi áp chảo',150000,1), ('Mực chiên nước mắm',110000,1),
('Tôm hấp bia',130000,1), ('Lẩu hải sản',200000,1), ('Cơm chiên hải sản',80000,1), ('Bún riêu',35000,1), ('Phở gà',40000,1),
('Trà đào',25000,1), ('Matcha đá xay',45000,1), ('Sinh tố bơ',30000,1), ('Cơm gà xối mỡ',50000,1), ('Cơm sườn nướng',55000,1),
('Cơm bò xào',60000,1), ('Cơm trứng chiên',30000,1), ('Cơm cá kho',45000,1), ('Bún bò Huế',40000,1), ('Hủ tiếu Nam Vang',42000,1),
('Mì quảng',40000,1), ('Bánh mì thịt',20000,1), ('Bánh mì chả cá',25000,1), ('Bánh mì trứng',18000,1), ('Bánh mì bò kho',30000,1),
('Gà rán giòn',70000,1), ('Gà sốt cay',75000,1), ('Gà chiên mắm',80000,1), ('Cánh gà chiên nước mắm',85000,1), ('Lẩu thái',180000,1),
('Lẩu bò',170000,1), ('Lẩu gà lá é',160000,1), ('Mực nướng sa tế',120000,1), ('Tôm nướng muối ớt',140000,1), ('Cá nướng giấy bạc',130000,1),
('Cơm chiên dương châu',70000,1), ('Cơm chiên cá mặn',75000,1), ('Cơm chiên bò',80000,1), ('Mì xào hải sản',90000,1), ('Mì xào bò',85000,1),
('Miến xào cua',95000,1), ('Bún thịt nướng',45000,1), ('Bún chả Hà Nội',50000,1), ('Bún mắm',55000,1), ('Cháo gà',30000,1),
('Cháo lòng',35000,1), ('Cháo hải sản',50000,1), ('Khoai tây chiên',30000,1), ('Khoai lang chiên',30000,1), ('Phô mai que',35000,1),
('Pepsi',10000,1), ('7Up',10000,1), ('Nước suối',8000,1), ('Nước cam',25000,1), ('Nước chanh',20000,1),
('Nước ép dứa',25000,1), ('Sinh tố xoài',30000,1), ('Sinh tố dâu',35000,1), ('Cafe đen',15000,1), ('Cafe sữa',20000,1),
('Bạc xỉu',25000,1), ('Capuccino',40000,1), ('Latte',45000,1), ('Trà sữa truyền thống',25000,1), ('Trà sữa trân châu',30000,1),
('Trà sữa matcha',35000,1), ('Trà sữa socola',35000,1), ('Kem vani',20000,1), ('Kem socola',20000,1), ('Kem dâu',20000,1),
('Bánh flan',15000,1), ('Rau câu dừa',15000,1);

-- ==========================================
-- 4. CẬP NHẬT HÌNH ẢNH MÓN ĂN
-- ==========================================
UPDATE mon_an SET image_url = 'https://maythucphamtoanphat.vn/uploads/images/bai-viet/cach-lam-com-rang.jpg' WHERE id = 1;
UPDATE mon_an SET image_url = 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/27/1413556/Pho-Ngoc-Vuong-3-Min.jpg' WHERE id = 2;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_12_638406880045931692_cach-lam-bun-cha-ha-noi-0.jpg' WHERE id = 3;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg' WHERE id = 4;
UPDATE mon_an SET image_url = 'https://bizweb.dktcdn.net/100/469/765/products/1503-9de8f3562b364e56b550ff30bc493122-2c0db7cc76fd4b7f8b3c767fb24bc277-d4f804d8fc474b4bae5f628ff0d632e0-master.jpg' WHERE id = 5;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/1089932/pexels-photo-1089932.jpeg' WHERE id = 6;
UPDATE mon_an SET image_url = 'https://i-giadinh.vnecdn.net/2022/04/02/Thanh-pham-1-1-7429-1648897030.jpg' WHERE id = 7;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/233305/pexels-photo-233305.jpeg' WHERE id = 8;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg' WHERE id = 9;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSszvmFy-VSP17B8vJUUcgAHG7dUX_-2FCD8Q&s' WHERE id = 10;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL1HQEkbX746qwjXvI79eIkAG6ezAyX0vCJQ&s' WHERE id = 11;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg' WHERE id = 12;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/com_chien_duong_chau_hai_san_2fd9d1a7a2.jpg' WHERE id = 13;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cach_nau_bun_rieu_cua_ha_noi_ed8278d38b.jpg' WHERE id = 14;
UPDATE mon_an SET image_url = 'https://cdn.zsoft.solutions/poseidon-web/app/media/uploaded-files/200823-cach-lam-pho-ga-buffet-poseidon.jpg' WHERE id = 15;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg' WHERE id = 16;
UPDATE mon_an SET image_url = 'https://eggyolk.vn/wp-content/uploads/2024/07/Tra-Xanh-Da-Xay-Green-Tea-Frappuccino.jpg' WHERE id = 17;
UPDATE mon_an SET image_url = 'https://www.cet.edu.vn/wp-content/uploads/2021/05/cach-lam-sinh-to-bo.jpg' WHERE id = 18;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg' WHERE id = 19;
UPDATE mon_an SET image_url = 'https://i.ytimg.com/vi/OVb5uoDWspM/hq720.jpg' WHERE id = 20;
UPDATE mon_an SET image_url = 'https://i.ytimg.com/vi/Mswtw9ZfN3k/hq720.jpg' WHERE id = 21;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/2122294/pexels-photo-2122294.jpeg' WHERE id = 22;
UPDATE mon_an SET image_url = 'https://hnm.vn/wp-content/uploads/2013/06/com-ca-tram-kho-to-1.jpg' WHERE id = 23;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_24_638337374919476057_bun-bo-hue.jpeg' WHERE id = 24;
UPDATE mon_an SET image_url = 'https://cdn.tgdd.vn/Files/2017/03/21/963404/cach-nau-hu-tieu-nam-vang-ngon-dung-dieu-tai-nha-202208251951367231.jpg' WHERE id = 25;
UPDATE mon_an SET image_url = 'https://cooponline.vn/tin-tuc/wp-content/uploads/2025/10/mi-quang-mon-dac-san-dam-da-thom-lung-xu-quang.png' WHERE id = 26;
UPDATE mon_an SET image_url = 'https://www.huongnghiepaau.com/wp-content/uploads/2019/08/banh-mi-kep-thit-nuong-thom-phuc.jpg' WHERE id = 27;
UPDATE mon_an SET image_url = 'https://cdn.tgdd.vn/2021/07/CookProduct/m1thum-1200x676.jpg' WHERE id = 28;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg' WHERE id = 29;
UPDATE mon_an SET image_url = 'https://banhmihanoi.net/wp-content/uploads/2020/05/banh-mi-bo-kho.jpg' WHERE id = 30;
UPDATE mon_an SET image_url = 'https://file.hstatic.net/200000700229/article/ga-ran-gion-1_83c75dcbff794589a4be4ae74e71c8e6.jpg' WHERE id = 31;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg' WHERE id = 32;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg' WHERE id = 33;
UPDATE mon_an SET image_url = 'https://iv.vnecdn.net/giadinh/images/web/2021/05/30/cach-lam-canh-ga-chien-nuoc-mam-dam-da-1622342840.jpg' WHERE id = 34;
UPDATE mon_an SET image_url = 'https://cooponline.vn/tin-tuc/wp-content/uploads/2025/10/Hinh-bia-5.jpg' WHERE id = 35;
UPDATE mon_an SET image_url = 'https://thitbonhat.vn/wp-content/uploads/2025/04/Lau-bo-nhung-dam.jpg' WHERE id = 36;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUaolQhoh1tlgJcSFufVnqbF1lv-cDPTcFzg&s' WHERE id = 37;
UPDATE mon_an SET image_url = 'https://shop.vietasiafoods.com/media/wysiwyg/Rectangle_39.png' WHERE id = 38;
UPDATE mon_an SET image_url = 'https://i-giadinh.vnecdn.net/2023/11/05/Thnhphm11-1699170028-3875-1699170031.jpg' WHERE id = 39;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg' WHERE id = 40;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/6294435/pexels-photo-6294435.jpeg' WHERE id = 41;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp)/2024_1_21_638414386326724630_cach-lam-com-chien-ca-man.jpg' WHERE id = 42;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2EJbP0fe1p_8arU7kr9elR3FphkgscUk3-g&s' WHERE id = 43;
UPDATE mon_an SET image_url = 'https://congthucgiadinh.com/storage/32/01J2FZRY300D7QSZ40NFK15V9A.jpg' WHERE id = 44;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg' WHERE id = 45;
UPDATE mon_an SET image_url = 'https://cdn.hstatic.net/files/200000700229/article/mien-xao-chay-1_3953cd03d4774eceb0af3389c8da60fe.jpg' WHERE id = 46;
UPDATE mon_an SET image_url = 'https://monngonmoingay.com/wp-content/uploads/2015/08/1.bunthitnuong1.png' WHERE id = 47;
UPDATE mon_an SET image_url = 'https://vcdn1-giadinh.vnecdn.net/2021/01/08/Anh-2-8146-1610.jpg' WHERE id = 48;
UPDATE mon_an SET image_url = 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/1/8/1290144/Bun-Mam-4.jpg' WHERE id = 49;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_16_638330975408711826_chao-ga.jpg' WHERE id = 50;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/chao_long_mien_tay_7b68d2cae5.jpg' WHERE id = 51;
UPDATE mon_an SET image_url = 'https://i-giadinh.vnecdn.net/2022/09/01/Thanh-pham-1-1-2232-1662004272.jpg' WHERE id = 52;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg' WHERE id = 53;
UPDATE mon_an SET image_url = 'https://haisanhuongmytran.com/wp-content/uploads/2025/11/klcv.jpg' WHERE id = 54;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_27_638339639184811505_anh-dai-dien.jpg' WHERE id = 55;
UPDATE mon_an SET image_url = 'https://product.hstatic.net/200000848723/product/pepi_afe7962d238e4789b3a0830b7ea74bb9_1024x1024.jpg' WHERE id = 56;
UPDATE mon_an SET image_url = 'https://product.hstatic.net/200000460455/product/7up_sleek_lon_320ml_e07c19bbd0c34a998d74c6f7d3d7d3a6_master.jpg' WHERE id = 57;
UPDATE mon_an SET image_url = 'https://anbinhphat.com/wp-content/uploads/2018/06/lavie-500ml-chai-moi-2.jpg' WHERE id = 58;
UPDATE mon_an SET image_url = 'https://shop.annam-gourmet.com/pub/media/catalog/product/i/t/item_F131383_8e64.jpg' WHERE id = 59;
UPDATE mon_an SET image_url = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/nuoc_ep_cam_dua_9_3c1e453889.jpg' WHERE id = 61;
UPDATE mon_an SET image_url = 'https://png.pngtree.com/png-vector/20240611/ourmid/pngtree-a-glass-of-mango-smoothie-with-straw-png-image_12652194.png' WHERE id = 62;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg' WHERE id = 64;
UPDATE mon_an SET image_url = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg' WHERE id = 65;
UPDATE mon_an SET image_url = 'https://product.hstatic.net/200000473381/product/vietnamese_white_coffee_959d080a2d0446238b51afadcdf62ebe_master.jpg' WHERE id = 66;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU20fjVZNnqtGyyG0le1ji8RytA83uug8QrQ&s' WHERE id = 69;
UPDATE mon_an SET image_url = 'https://hachihachi.com.vn/Uploads/_6/CMS/Blog/AmThuc/2025/T2/tra-sua-matcha.jpg' WHERE id = 71;
UPDATE mon_an SET image_url = 'https://viettuantea.vn/wp-content/uploads/2022/01/kem-vanilla-viet-tuan-2kg-3000ml-3.jpg' WHERE id = 73;
UPDATE mon_an SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToAwW2DrPCqKJtggxZ5DUlQ_pU7YjtD1zIEQ&s' WHERE id = 74;
UPDATE mon_an SET image_url = 'https://file.hstatic.net/200000079049/file/cach-lam-kem-dau_0cb760a036de4823babbf9a06bd42568.jpg' WHERE id = 75;
UPDATE mon_an SET image_url = 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/11/cach-lam-caramen-thumbnail.jpg' WHERE id = 76;
UPDATE mon_an SET image_url = 'https://unica.vn/media/imagesck/1628040951_cach-lam-rau-cau-trai-dua-2.jpg' WHERE id = 77;

-- ==========================================
-- 5. CẬP NHẬT CATEGORY
-- ==========================================
SET SQL_SAFE_UPDATES = 0;

-- 2. CHẠY LỆNH CẬP NHẬT CATEGORY
UPDATE mon_an SET category = 'COM' WHERE ten_mon LIKE '%Cơm%' OR ten_mon LIKE '%cơm%';
UPDATE mon_an SET category = 'BUN_PHO' WHERE ten_mon LIKE '%bún%' OR ten_mon LIKE '%phở%' OR ten_mon LIKE '%mì%' OR ten_mon LIKE '%miến%' OR ten_mon LIKE '%hủ tiếu%';
UPDATE mon_an SET category = 'BANH_MI' WHERE ten_mon LIKE '%bánh mì%';
UPDATE mon_an SET category = 'LAU_NUONG' WHERE ten_mon LIKE '%lẩu%' OR ten_mon LIKE '%nướng%';
UPDATE mon_an SET category = 'NUOC' WHERE ten_mon LIKE '%trà%' OR ten_mon LIKE '%cafe%' OR ten_mon LIKE '%cà phê%' OR ten_mon LIKE '%sinh tố%' OR ten_mon LIKE '%nước%' OR ten_mon LIKE '%pepsi%' OR ten_mon LIKE '%7up%' OR ten_mon LIKE '%bia%' OR ten_mon LIKE '%latte%' OR ten_mon LIKE '%capuccino%' OR ten_mon LIKE '%bạc xỉu%';
UPDATE mon_an SET category = 'AN_VAT' WHERE ten_mon LIKE '%khoai%' OR ten_mon LIKE '%phô mai%' OR ten_mon LIKE '%gà rán%';
UPDATE mon_an SET category = 'TRANG_MIENG' WHERE ten_mon LIKE '%kem%' OR ten_mon LIKE '%flan%' OR ten_mon LIKE '%rau câu%';
UPDATE mon_an SET category = 'MON_CHINH' WHERE category IS NULL;

-- 3. BẬT LẠI CHẾ ĐỘ BẢO VỆ CHO AN TOÀN
SET SQL_SAFE_UPDATES = 1;

-- ==========================================
-- 6. THÊM DỮ LIỆU HÓA ĐƠN
-- ==========================================
INSERT INTO hoa_don (ban_id, thoi_diem_mo, thoi_diem_thanh_toan, trang_thai, tong_tien) VALUES
(1, CONCAT(CURDATE(), ' 08:00:00'), CONCAT(CURDATE(), ' 09:00:00'), 'DA_THANH_TOAN', 150000),
(2, CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 11:00:00'), 'DA_THANH_TOAN', 220000),
(3, CONCAT(CURDATE(), ' 12:30:00'), CONCAT(CURDATE(), ' 13:15:00'), 'DA_THANH_TOAN', 180000),
(4, CONCAT(CURDATE(), ' 18:00:00'), NULL, 'DANG_MO', 0),
(1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 08:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 09:30:00'), 'DA_THANH_TOAN', 200000),
(2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 12:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 13:00:00'), 'DA_THANH_TOAN', 300000),
(3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 19:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 20:00:00'), 'DA_THANH_TOAN', 275000),
(1, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 07:45:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:30:00'), 'DA_THANH_TOAN', 120000),
(2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 11:15:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 12:00:00'), 'DA_THANH_TOAN', 260000),
(4, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 18:30:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 19:30:00'), 'DA_THANH_TOAN', 310000);
USE restaurant_db;

-- 1. TẮT CHẾ ĐỘ BẢO VỆ AN TOÀN
SET SQL_SAFE_UPDATES = 0;

-- 2. CHẠY LỆNH CẬP NHẬT CATEGORY
UPDATE mon_an SET category = 'COM' WHERE ten_mon LIKE '%Cơm%' OR ten_mon LIKE '%cơm%';
UPDATE mon_an SET category = 'BUN_PHO' WHERE ten_mon LIKE '%bún%' OR ten_mon LIKE '%phở%' OR ten_mon LIKE '%mì%' OR ten_mon LIKE '%miến%' OR ten_mon LIKE '%hủ tiếu%';
UPDATE mon_an SET category = 'BANH_MI' WHERE ten_mon LIKE '%bánh mì%';
UPDATE mon_an SET category = 'LAU_NUONG' WHERE ten_mon LIKE '%lẩu%' OR ten_mon LIKE '%nướng%';
UPDATE mon_an SET category = 'NUOC' WHERE ten_mon LIKE '%trà%' OR ten_mon LIKE '%cafe%' OR ten_mon LIKE '%cà phê%' OR ten_mon LIKE '%sinh tố%' OR ten_mon LIKE '%nước%' OR ten_mon LIKE '%pepsi%' OR ten_mon LIKE '%7up%' OR ten_mon LIKE '%bia%' OR ten_mon LIKE '%latte%' OR ten_mon LIKE '%capuccino%' OR ten_mon LIKE '%bạc xỉu%';
UPDATE mon_an SET category = 'AN_VAT' WHERE ten_mon LIKE '%khoai%' OR ten_mon LIKE '%phô mai%' OR ten_mon LIKE '%gà rán%';
UPDATE mon_an SET category = 'TRANG_MIENG' WHERE ten_mon LIKE '%kem%' OR ten_mon LIKE '%flan%' OR ten_mon LIKE '%rau câu%';
UPDATE mon_an SET category = 'MON_CHINH' WHERE category IS NULL;

-- 3. BẬT LẠI CHẾ ĐỘ BẢO VỆ CHO AN TOÀN
SET SQL_SAFE_UPDATES = 1;
