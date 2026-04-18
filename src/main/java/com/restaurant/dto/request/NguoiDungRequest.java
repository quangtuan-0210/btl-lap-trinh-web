package com.restaurant.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDungRequest {
    private String username;
    private String password;
    private String email;
    private String role;
}