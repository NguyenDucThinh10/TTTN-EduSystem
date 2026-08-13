package com.edulms.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.entity.Role;
import com.edulms.service.CurrentUserService;
import com.edulms.service.FileStorageService;
import com.edulms.service.FileValidator;
import com.edulms.service.UnauthorizedClassAccessException;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    private final FileStorageService fileStorageService;
    private final FileValidator fileValidator;
    private final CurrentUserService currentUserService;

    public FileController(
            FileStorageService fileStorageService,
            FileValidator fileValidator,
            CurrentUserService currentUserService) {
        this.fileStorageService = fileStorageService;
        this.fileValidator = fileValidator;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/assignments")
    public ResponseEntity<Map<String, String>> uploadAssignmentFile(@RequestParam("file") MultipartFile file) {
        Role role = currentUserService.getCurrentUser().getRole();
        if (role != Role.TEACHER && role != Role.ADMIN) {
            throw new UnauthorizedClassAccessException("Chi giang vien moi duoc upload file de bai");
        }
        fileValidator.validate(file);
        String fileUrl = fileStorageService.storeAssignmentFile(file);
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }
}
