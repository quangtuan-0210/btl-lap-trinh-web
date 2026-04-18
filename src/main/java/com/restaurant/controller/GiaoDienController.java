package com.restaurant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GiaoDienController {

    @GetMapping("/")
    public String trangChu() {
        return "index"; // Trỏ đúng tên file index.html trong templates
    }

    @GetMapping("/login")
    public String dangNhap() {
        return "login"; // Trỏ đúng tên file login.html
    }

    @GetMapping("/admin")
    public String trangAdmin() {
        return "admin"; // Trỏ đúng tên file admin.html
    }

    @GetMapping("/cashier")
    public String trangThuNgan() {
        return "cashier"; // Trỏ đúng tên file cashier.html
    }
}