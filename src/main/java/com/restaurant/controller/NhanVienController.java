package com.restaurant.controller;

import com.restaurant.dto.request.NguoiDungRequest;
import com.restaurant.dto.response.NguoiDungResponse;
import com.restaurant.service.NguoiDungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhan-vien")
@PreAuthorize("hasAuthority('ADMIN')")
public class NhanVienController {

    @Autowired
    private NguoiDungService nguoiDungService;

    // 1. Lấy danh sách toàn bộ nhân viên
    @GetMapping
    public List<NguoiDungResponse> getAll() {
        return nguoiDungService.getAllUsers();
    }

    // 2. Thêm nhân viên mới
    @PostMapping
    public NguoiDungResponse create(@RequestBody NguoiDungRequest request) {
        return nguoiDungService.createUser(request);
    }

    // 3. Cập nhật thông tin nhân viên
    @PutMapping("/{id}")
    public NguoiDungResponse update(@PathVariable Long id, @RequestBody NguoiDungRequest request) {
        return nguoiDungService.updateUser(id, request);
    }

    // 4. Xóa nhân viên
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        nguoiDungService.deleteUser(id);
    }
}