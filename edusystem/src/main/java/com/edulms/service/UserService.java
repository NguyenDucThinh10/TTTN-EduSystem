package com.edulms.service;

import org.springframework.data.domain.Page;

import com.edulms.dto.CreateUserRequest;
import com.edulms.dto.UserResponse;
import com.edulms.entity.UserStatus;

public interface UserService {
    Page<UserResponse> getAllUsers(int page, int size);
    UserResponse createUser(CreateUserRequest request);
    UserResponse updateUser(Long id, CreateUserRequest request); // [THÊM MỚI] Hàm cập nhật người dùng
    UserResponse changeUserStatus(Long id, UserStatus newStatus);
    

    void importUsersFromExcel(org.springframework.web.multipart.MultipartFile file);
}

