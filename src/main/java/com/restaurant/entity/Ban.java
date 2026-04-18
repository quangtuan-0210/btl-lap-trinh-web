package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ban")
@Getter
@Setter
public class Ban {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenBan;

    @Enumerated(EnumType.STRING)
    private TrangThaiBan trangThai = TrangThaiBan.TRONG;
}