package com.restaurant.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private int code;
    private String message;
    private T result;
}