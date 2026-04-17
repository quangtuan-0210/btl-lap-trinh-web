package com.restaurant.controller;

import com.restaurant.dto.response.*;
import com.restaurant.exception.ErrorCode;
import com.restaurant.service.BanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/ban")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
public class BanController {

    private final BanService service;

    @GetMapping
    public ApiResponse<List<BanResponse>> getAllBan() {

        return ApiResponse.<List<BanResponse>>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Lấy danh sách bàn thành công")
                .result(service.getAllBan())
                .build();
    }
}