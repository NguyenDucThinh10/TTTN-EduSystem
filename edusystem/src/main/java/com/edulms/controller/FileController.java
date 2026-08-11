package com.edulms.controller;

import com.edulms.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        
        // Trả về một JSON chứa đường dẫn/tên file để Frontend lưu vào Database (Bảng Material hoặc Submission)
        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("url", "/uploads/" + fileName); 
        
        return ResponseEntity.ok(response);
    }
}