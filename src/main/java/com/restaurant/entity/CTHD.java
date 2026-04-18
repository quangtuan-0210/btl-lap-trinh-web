package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cthd")
@Getter
@Setter
public class CTHD {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private HoaDon hoaDon;

    @ManyToOne
    private MonAn monAn;

    private Integer soLuong;

    private Double donGia;
}