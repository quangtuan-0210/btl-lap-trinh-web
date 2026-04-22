# 🍽️ Hệ Thống Quản Lý Nhà Hàng (Restaurant POS)

![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Thymeleaf](https://img.shields.io/badge/Thymeleaf-%23005C0F.svg?style=for-the-badge&logo=Thymeleaf&logoColor=white)

Đây là dự án **Bài Tập Lớn môn Lập trình Web**, mô phỏng hệ thống quản lý bán hàng (POS - Point of Sale) và phục vụ tại bàn dành cho nhà hàng/quán ăn. Hệ thống được xây dựng theo kiến trúc MVC chuẩn, tích hợp phân quyền bảo mật và xử lý luồng gọi món/thanh toán theo thời gian thực.

---

## 🚀 Công nghệ sử dụng

* **Backend:** Java 21, Spring Boot 3.x, Spring Data JPA.
* **Frontend:** HTML5, CSS3, JavaScript, Thymeleaf (Server-side rendering).
* **Database:** MySQL.
* **Bảo mật:** Spring Security, JSON Web Token (JWT).
* **Quản lý phiên bản DB:** Flyway / Data Seeding.

---

## ⚙️ Kiến trúc & Luồng Dữ Liệu (Data Flows)

Dự án áp dụng chặt chẽ mô hình **3-Tier Architecture** kết hợp Security Filter. Đường ống dữ liệu (Pipeline) tiêu chuẩn đi qua 5 trạm: `Client ➔ JwtFilter ➔ Controller ➔ Service ➔ Repository ➔ MySQL`.

Hệ thống xoay quanh 5 luồng nghiệp vụ chính:

### 1. Luồng Xác thực & Phân quyền (Authentication Flow)
* **Quy trình:** Người dùng gửi thông tin đăng nhập ➔ `AuthController` tiếp nhận ➔ `NguoiDungService` kiểm tra CSDL và xác thực mật khẩu (BCrypt) ➔ `JwtService` sinh ra chuỗi Token chứa Role (ADMIN/STAFF).
* **Bảo mật:** Mọi API nghiệp vụ phía sau đều được bảo vệ bởi `JwtFilter`. Request thiếu Token hoặc sai Role sẽ bị chặn lập tức (401/403).

### 2. Luồng Phục vụ tại bàn (POS / Ordering Flow)
* **Quy trình:** Nhân viên chọn món ➔ `PosController` nhận `GoiMonRequest` ➔ `PosService` kiểm tra trạng thái bàn.
* **Xử lý Logic:** Nếu bàn trống, tự động tạo mới `HoaDon`. Ghi nhận `CTHD` (Chi tiết hóa đơn) với số lượng/đơn giá tương ứng và cập nhật trạng thái `Ban` thành `CO_KHACH`. Màn hình Thu ngân tự động đổi màu hiển thị của bàn.

### 3. Luồng Thanh toán (Checkout Flow)
* **Quy trình:** Nhận yêu cầu thanh toán từ Client ➔ `PosService` truy xuất `HoaDon` hiện tại của bàn.
* **Xử lý Logic:** Quét toàn bộ `CTHD`, tính toán `tongTien`. Cập nhật thời điểm thanh toán, chốt hóa đơn (`DA_THANH_TOAN`) và giải phóng bàn (`TRONG`) để đón khách mới.

### 4. Luồng Quản trị (Admin CRUD Flow)
* Dành riêng cho `ROLE_ADMIN` để thêm/sửa/xóa Món ăn, phân quyền Nhân viên. Các API này được cấu hình rào chắn nghiêm ngặt trong `SecurityConfig`. 

### 5. Luồng Khách hàng tự gọi món (QR Self-Ordering Flow)
* Khách quét mã QR tại bàn ➔ Mở menu ảo trên điện thoại ➔ Gửi trực tiếp `GoiMonRequest` vào hệ thống API ➔ Cập nhật dữ liệu ngầm và phản hồi thẳng lên màn hình của nhân viên Thu ngân theo thời gian thực.

---

## 📂 Cấu trúc dự án

```text
src/main/java/com/restaurant
 ├── config/        # Cấu hình Security, JWT, Khởi tạo dữ liệu (DataInitializer)
 ├── controller/    # Xử lý HTTP Request & Trả về Giao diện/API
 ├── dto/           # Data Transfer Objects (Request/Response)
 ├── entity/        # Mapping Database Models (HoaDon, CTHD, Ban, MonAn...)
 ├── exception/     # Xử lý ngoại lệ tập trung (GlobalExceptionHandler)
 ├── repository/    # Tương tác với CSDL qua Spring Data JPA
 └── service/       # Chứa Business Logic cốt lõi của hệ thống
