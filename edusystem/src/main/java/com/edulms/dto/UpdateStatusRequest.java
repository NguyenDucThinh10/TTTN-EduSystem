package com.edulms.dto;

import com.edulms.entity.UserStatus;

import lombok.Data;

@Data
public class UpdateStatusRequest {
    private UserStatus status; // ACTIVE hoặc INACTIVE
}