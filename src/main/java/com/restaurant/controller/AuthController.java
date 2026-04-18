package com.restaurant.controller;

import com.restaurant.dto.request.LoginRequest;
import com.restaurant.dto.response.ApiResponse;
import com.restaurant.dto.response.NguoiDungResponse;
import com.restaurant.entity.NguoiDung;
import com.restaurant.exception.ErrorCode;
import com.restaurant.service.JwtService;
import com.restaurant.service.NguoiDungService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private NguoiDungService nguoiDungService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ApiResponse<NguoiDungResponse> login(@RequestBody LoginRequest request, HttpSession session) {

        NguoiDung user = nguoiDungService.checkLogin(request.getUsername(), request.getPassword());

        String token = jwtService.generateToken(user);

        session.setAttribute("user", user);

        return ApiResponse.<NguoiDungResponse>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Đăng nhập thành công")
                .result(NguoiDungResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .token(token)
                        .build())
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.<String>builder()
                .code(ErrorCode.SUCCESS.getCode())
                .message("Đăng xuất thành công")
                .build();
    }
}