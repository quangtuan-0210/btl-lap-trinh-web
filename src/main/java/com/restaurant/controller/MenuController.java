package com.restaurant.controller;

import com.restaurant.dto.request.MonAnRequest;
import com.restaurant.dto.response.*;
import com.restaurant.exception.ErrorCode;
import com.restaurant.service.MonAnService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MonAnService service;

    @PostMapping
    public ApiResponse<MonAnResponse> create(@RequestBody MonAnRequest request) {
        return ApiResponse.<MonAnResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message(ErrorCode.SUCCESS.getMessage())
                .result(service.create(request))
                .build();
    }

    // ✅ THÊM API UPDATE
    @PutMapping("/{id}")
    public ApiResponse<MonAnResponse> update(
            @PathVariable Long id,
            @RequestBody MonAnRequest request) {
        return ApiResponse.<MonAnResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Cập nhật thành công")
                .result(service.update(id, request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MonAnResponse>> getAll() {
        return ApiResponse.<List<MonAnResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message(ErrorCode.SUCCESS.getMessage())
                .result(service.getAll())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Xóa thành công")
                .result(null)
                .build();
    }
    @GetMapping("/top-5")
    public ApiResponse<List<Object[]>> getTop5MonAn() {
        return ApiResponse.<List<Object[]>>builder()
                .result(service.getTop5MonAn())
                .build();
    }
}