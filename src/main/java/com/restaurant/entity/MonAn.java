package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mon_an")
@Getter
@Setter
public class MonAn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenMon;

    private Double gia;

    @Column(name = "image_url")

    private String imageUrl;

    private Boolean active = true;
}