package com.edulms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType;
    private Long id;
    private String username;
    private String fullName;
    private String role;
}
