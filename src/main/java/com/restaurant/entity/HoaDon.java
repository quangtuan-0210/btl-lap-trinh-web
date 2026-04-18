package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don")
@Getter
@Setter
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Ban ban;

    private LocalDateTime thoiDiemMo;

    private LocalDateTime thoiDiemThanhToan;

    @Enumerated(EnumType.STRING)
    private TrangThaiHoaDon trangThai;

    private Double tongTien;
}