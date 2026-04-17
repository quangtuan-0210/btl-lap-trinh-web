package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class MonAnResponse {
    private Long id;
    private String tenMon;
    private Double gia;
    private String imageUrl;
    private Boolean active;
}