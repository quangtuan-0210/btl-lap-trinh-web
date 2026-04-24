package com.restaurant.controller;

import com.restaurant.dto.request.CustomerOrderItemRequest;
import com.restaurant.dto.request.GoiMonRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.BanResponse;
import com.restaurant.dto.response.MonAnResponse;
import com.restaurant.entity.CTHD;
import com.restaurant.entity.HoaDon;
import com.restaurant.entity.TrangThaiHoaDon;
import com.restaurant.exception.AppException;
import com.restaurant.exception.ErrorCode;
import com.restaurant.repository.HoaDonRepository;
import com.restaurant.repository.MonAnRepository;
import com.restaurant.service.BanService;
import com.restaurant.service.MonAnService;
import com.restaurant.service.PosService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final MonAnService monAnService;
    private final BanService banService;
    private final PosService posService;
    private final HoaDonRepository hoaDonRepository;
    private final MonAnRepository monAnRepository;

    // Khách hàng xem toàn bộ menu (chỉ những món đang active)
    @GetMapping("/menu")
    public ApiResponse<List<MonAnResponse>> getMenu() {
        return ApiResponse.<List<MonAnResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message(ErrorCode.SUCCESS.getMessage())
                .result(monAnService.getAll())
                .build();
    }

    // Khách hàng xem danh sách tất cả các bàn
    @GetMapping("/ban")
    public ApiResponse<List<BanResponse>> getBan() {
        return ApiResponse.<List<BanResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Lấy danh sách bàn thành công")
                .result(banService.getAllBan())
                .build();
    }

    // Khách hàng đặt món cho bàn đã chọn
    @PostMapping("/order/{banId}")
    public ApiResponse<?> datMon(
            @PathVariable Long banId,
            @RequestBody List<CustomerOrderItemRequest> items
    ) {
        // Kiểm tra danh sách không rỗng
        if (items == null || items.isEmpty()) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        for (CustomerOrderItemRequest item : items) {
            if (item.getSoLuong() == null || item.getSoLuong() < 1 || item.getSoLuong() > 30) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
            }
            if (item.getMonAnId() == null) {
                throw new AppException(ErrorCode.MON_AN_NOT_FOUND);
            }
            com.restaurant.entity.MonAn monAn = monAnRepository.findById(item.getMonAnId())
                    .orElseThrow(() -> new AppException(ErrorCode.MON_AN_NOT_FOUND));
            if (Boolean.FALSE.equals(monAn.getActive())) {
                throw new AppException(ErrorCode.MON_AN_TAM_NGUNG);
            }
        }

        // Kiểm tra bàn có đang có hóa đơn chưa thanh toán không (bàn đang có khách ăn)
        Optional<HoaDon> existingHoaDon = hoaDonRepository
                .findFirstByBanIdAndTrangThai(banId, TrangThaiHoaDon.CHUA_THANH_TOAN);

        HoaDon hoaDon;
        hoaDon = existingHoaDon.orElseGet(() -> posService.moBan(banId));

        // Thêm từng món vào hóa đơn
        for (CustomerOrderItemRequest item : items) {
            GoiMonRequest req = new GoiMonRequest();
            req.setHoaDonId(hoaDon.getId());
            req.setMonAnId(item.getMonAnId());
            req.setSoLuong(item.getSoLuong());
            posService.goiMon(req);
        }

        return ApiResponse.builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Đặt món thành công! Nhân viên sẽ phục vụ bạn trong giây lát.")
                .result(null)
                .build();
    }
    @GetMapping("/hoa-don/{banId}")
    public ApiResponse<List<CTHD>> getHoaDonTheoBan(@PathVariable Long banId) {

        // tìm hóa đơn chưa thanh toán của bàn
        Optional<HoaDon> hoaDonOpt = hoaDonRepository
                .findFirstByBanIdAndTrangThai(banId, TrangThaiHoaDon.CHUA_THANH_TOAN);

        if (hoaDonOpt.isEmpty()) {
            return ApiResponse.<List<CTHD>>builder()
                    .code(ErrorCode.SUCCESS.getCode())
                    .result(List.of()) // 👈 QUAN TRỌNG: trả rỗng
                    .build();
        }

        HoaDon hoaDon = hoaDonOpt.get();

        List<CTHD> chiTiet = posService.getChiTietHoaDon(hoaDon.getId());

        return ApiResponse.<List<CTHD>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .result(chiTiet)
                .build();
    }
}
