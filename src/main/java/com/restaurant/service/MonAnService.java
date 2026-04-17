package com.restaurant.service;

import com.restaurant.dto.request.MonAnRequest;
import com.restaurant.dto.response.MonAnResponse;
import com.restaurant.entity.MonAn;
import com.restaurant.exception.*;
import com.restaurant.repository.CTHDRepository;
import com.restaurant.repository.MonAnRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonAnService {

    private final MonAnRepository repository;
    private final CTHDRepository cthdRepository;

    public MonAnResponse create(MonAnRequest request) {
        MonAn mon = new MonAn();
        mon.setTenMon(request.getTenMon());
        mon.setGia(request.getGia());
        mon.setActive(request.getActive());
        mon.setImageUrl(request.getImageUrl());

        repository.save(mon);

        return MonAnResponse.builder()
                .id(mon.getId())
                .tenMon(mon.getTenMon())
                .gia(mon.getGia())
                .build();
    }

    public List<MonAnResponse> getAll() {
        return repository.findAll().stream()
                .map(mon -> MonAnResponse.builder()
                        .id(mon.getId())
                        .tenMon(mon.getTenMon())
                        .gia(mon.getGia())
                        .imageUrl(mon.getImageUrl())
                        .active(mon.getActive())
                        .build())
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new AppException(ErrorCode.MON_AN_NOT_FOUND);
        }

        // xóa chi tiết hóa đơn trước
        cthdRepository.deleteByMonAnId(id);

        // xóa món ăn
        repository.deleteById(id);
    }

    public MonAnResponse update(Long id, MonAnRequest request) {
        MonAn mon = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MON_AN_NOT_FOUND));

        mon.setTenMon(request.getTenMon());
        mon.setGia(request.getGia());
        mon.setActive(request.getActive());
        mon.setImageUrl(request.getImageUrl());

        repository.save(mon);

        return MonAnResponse.builder()
                .id(mon.getId())
                .tenMon(mon.getTenMon())
                .gia(mon.getGia())
                .imageUrl(mon.getImageUrl())
                .active(mon.getActive())
                .build();
    }
    public List<Object[]> getTop5MonAn() {
        return cthdRepository.findTopMonAn(PageRequest.of(0, 5));
    }
}