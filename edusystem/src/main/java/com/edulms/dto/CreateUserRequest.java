package com.edulms.dto;

import com.edulms.entity.Role;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private Role role; // ADMIN, TEACHER, STUDENT
}