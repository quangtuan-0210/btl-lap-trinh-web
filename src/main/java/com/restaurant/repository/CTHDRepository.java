package com.restaurant.repository;

import com.restaurant.entity.CTHD;
import com.restaurant.entity.HoaDon;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CTHDRepository extends JpaRepository<CTHD, Long> {

    List<CTHD> findByHoaDon(HoaDon hoaDon);

    void deleteByMonAnId(Long monAnId);

    @Query("""
        SELECT c.monAn.tenMon, SUM(c.soLuong)
        FROM CTHD c
        GROUP BY c.monAn.id, c.monAn.tenMon
        ORDER BY SUM(c.soLuong) DESC
    """)
    List<Object[]> findTopMonAn(Pageable pageable);
}