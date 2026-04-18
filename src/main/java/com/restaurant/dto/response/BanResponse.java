package com.restaurant.dto.response;

import com.restaurant.entity.TrangThaiBan;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BanResponse {

    private Long id;
    private String tenBan;
    private TrangThaiBan trangThai;
}