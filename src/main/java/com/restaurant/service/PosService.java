package com.restaurant.service;

import com.restaurant.dto.request.GoiMonRequest;
import com.restaurant.entity.*;
import com.restaurant.exception.*;
import com.restaurant.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PosService {

    private final BanRepository banRepository;
    private final HoaDonRepository hoaDonRepository;
    private final CTHDRepository cthdRepository;
    private final MonAnRepository monAnRepository;

    @Transactional
    public HoaDon moBan(Long banId) {
        Ban ban = banRepository.findById(banId)
                .orElseThrow(() -> new AppException(ErrorCode.BAN_NOT_FOUND));

        Optional<HoaDon> existing = hoaDonRepository
                .findFirstByBanIdAndTrangThai(banId, TrangThaiHoaDon.CHUA_THANH_TOAN);

        if (existing.isPresent()) {
            return existing.get();
        }

        HoaDon hoaDon = new HoaDon();
        hoaDon.setBan(ban);
        hoaDon.setTrangThai(TrangThaiHoaDon.CHUA_THANH_TOAN);
        hoaDon.setThoiDiemMo(LocalDateTime.now());

        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public void goiMon(GoiMonRequest request) {
        HoaDon hoaDon = hoaDonRepository.findById(request.getHoaDonId())
                .orElseThrow(() -> new AppException(ErrorCode.HOA_DON_NOT_FOUND));

        MonAn mon = monAnRepository.findById(request.getMonAnId())
                .orElseThrow(() -> new AppException(ErrorCode.MON_AN_NOT_FOUND));

        List<CTHD> dsChiTiet = cthdRepository.findByHoaDon(hoaDon);
        Optional<CTHD> duplicateMon = dsChiTiet.stream()
                .filter(ct -> ct.getMonAn().getId().equals(mon.getId()))
                .findFirst();

        if (duplicateMon.isPresent()) {
            CTHD existingCt = duplicateMon.get();
            existingCt.setSoLuong(existingCt.getSoLuong() + request.getSoLuong());
            cthdRepository.save(existingCt);
        } else {
            CTHD ct = new CTHD();
            ct.setHoaDon(hoaDon);
            ct.setMonAn(mon);
            ct.setSoLuong(request.getSoLuong());
            ct.setDonGia(mon.getGia());
            cthdRepository.save(ct);
        }

        Ban ban = hoaDon.getBan();
        if (ban.getTrangThai() != TrangThaiBan.CO_KHACH) {
            ban.setTrangThai(TrangThaiBan.CO_KHACH);
            banRepository.save(ban);
        }
    }

    @Transactional
    public Double thanhToan(Long hoaDonId) {
        HoaDon hoaDon = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_DON_NOT_FOUND));

        List<CTHD> ds = cthdRepository.findByHoaDon(hoaDon);
        double tong = ds.stream().mapToDouble(ct -> ct.getSoLuong() * ct.getDonGia()).sum();

        hoaDon.setTongTien(tong);
        hoaDon.setTrangThai(TrangThaiHoaDon.DA_THANH_TOAN);
        hoaDon.setThoiDiemThanhToan(LocalDateTime.now());

        Ban ban = hoaDon.getBan();
        ban.setTrangThai(TrangThaiBan.TRONG);
        banRepository.save(ban);
        hoaDonRepository.save(hoaDon);

        return tong;
    }

    @Transactional
    public void capNhatSoLuong(Long cthdId, Integer soLuong) {
        CTHD cthd = cthdRepository.findById(cthdId)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_DON_NOT_FOUND));

        if (soLuong <= 0) {
            xoaMonKhoiHoaDon(cthdId);
        } else {
            cthd.setSoLuong(soLuong);
            cthdRepository.save(cthd);
        }
    }

    @Transactional
    public void xoaMonKhoiHoaDon(Long cthdId) {
        CTHD cthd = cthdRepository.findById(cthdId)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_DON_NOT_FOUND));

        HoaDon hoaDon = cthd.getHoaDon();
        cthdRepository.delete(cthd);

        // Sau khi xóa, nếu hóa đơn không còn món nào, chuyển bàn về TRỐNG
        List<CTHD> remaining = cthdRepository.findByHoaDon(hoaDon);
        if (remaining.isEmpty()) {
            Ban ban = hoaDon.getBan();
            ban.setTrangThai(TrangThaiBan.TRONG);
            banRepository.save(ban);
        }
    }

    public List<CTHD> getChiTietHoaDon(Long hoaDonId) {
        HoaDon hoaDon = hoaDonRepository.findById(hoaDonId)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_DON_NOT_FOUND));
        return cthdRepository.findByHoaDon(hoaDon);
    }
    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAllByOrderByIdDesc();
    }

    public List<HoaDon> getHoaDonByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        return hoaDonRepository.findByThoiDiemMoBetweenOrderByIdDesc(start, end);
    }
}