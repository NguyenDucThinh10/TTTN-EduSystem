package com.edulms.dto;

import com.edulms.entity.Role;
import com.edulms.entity.UserStatus;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status = UserStatus.ACTIVE;
    
}