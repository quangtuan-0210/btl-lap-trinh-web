package com.restaurant.service;

import com.restaurant.dto.response.BanResponse;
import com.restaurant.repository.BanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BanService {

    private final BanRepository repository;

    public List<BanResponse> getAllBan() {

        return repository.findAll().stream()
                .map(ban -> BanResponse.builder()
                        .id(ban.getId())
                        .tenBan(ban.getTenBan())
                        .trangThai(ban.getTrangThai())
                        .build())
                .toList();
    }
}