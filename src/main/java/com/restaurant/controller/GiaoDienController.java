package com.restaurant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GiaoDienController {

    @GetMapping("/")
    public String trangChu() {
        return "index";
    }

    @GetMapping("/login")
    public String dangNhap() {
        return "login";
    }

    @GetMapping("/admin")
    public String trangAdmin() {
        return "admin";
    }

    @GetMapping("/cashier")
    public String trangThuNgan() {
        return "cashier";
    }

    @GetMapping("/order")
    public String trangDatMon() {
        return "order";
    }
}