package com.restaurant.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonAnRequest {
    private String tenMon;
    private Double gia;
    private Boolean active;
    private String imageUrl; // thêm dòng này
}