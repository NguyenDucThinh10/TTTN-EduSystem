package com.edulms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.UserResponse;
import com.edulms.entity.User;
import com.edulms.service.CurrentUserService;

@RestController
@RequestMapping("/api/me")
public class ProfileController {

    private final CurrentUserService currentUserService;

    public ProfileController(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getCurrentProfile() {
        User user = currentUserService.getCurrentUser();
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        return ResponseEntity.ok(response);
    }
}
