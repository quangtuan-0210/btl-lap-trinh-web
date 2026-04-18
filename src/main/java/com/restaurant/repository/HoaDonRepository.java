package com.restaurant.repository;

import com.restaurant.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {

    Optional<HoaDon> findFirstByBanIdAndTrangThai(Long banId, TrangThaiHoaDon trangThai);
    List<HoaDon> findAllByOrderByIdDesc();

    List<HoaDon> findByThoiDiemMoBetweenOrderByIdDesc(
            LocalDateTime start,
            LocalDateTime end
    );
}