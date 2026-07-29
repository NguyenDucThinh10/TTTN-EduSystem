package com.edulms.dto;

import com.edulms.entity.Role;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private Role role = Role.STUDENT;
}
