package com.restaurant.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NguoiDungResponse {
    private Long id;
    private String username;
    private String email;
    private String role;

    private String token;
}