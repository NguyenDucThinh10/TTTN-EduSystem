package com.edulms.controller;

import com.edulms.entity.ClassEntity;
import com.edulms.entity.Material;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.MaterialRepository;
import com.edulms.repository.UserRepository;
import com.edulms.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    
    //Inject các Repository cần thiết cho phân hệ Tài liệu
    private final MaterialRepository materialRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

   
    // [GIỮ NGUYÊN] API Upload chung ban đầu 
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        
        // Trả về một JSON chứa đường dẫn/tên file để Frontend lưu vào Database (Bảng Material hoặc Submission)
        Map<String, String> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("url", "/uploads/" + fileName); 
        
        return ResponseEntity.ok(response);
    }

    
    // 1. API TẢI LÊN TÀI LIỆU (Lưu luôn vào DB)
   
    @PostMapping("/materials/upload")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("classId") Long classId,
            @RequestParam("uploaderId") Long uploaderId) {
        
        try {
            // 1. Kiểm tra Lớp học và Người tải lên có tồn tại không
            ClassEntity classEntity = classRepository.findById(classId)
                    .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));
            User uploader = userRepository.findById(uploaderId)
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // 2. Gọi FileStorageService lưu file vật lý vào thư mục
            String fileName = fileStorageService.storeFile(file);

            // 3. Tạo record lưu vào Database
            Material material = new Material();
            material.setTitle(title);
            material.setDescription(description);
            material.setFileName(fileName);
            material.setFileType(file.getContentType());
            material.setFileUrl("/api/files/download/" + fileName); // Trỏ về API download bên dưới
            material.setClassEntity(classEntity);
            material.setUploader(uploader);
            material.setIsVisible(true);

            materialRepository.save(material);

            return ResponseEntity.ok("Tải tài liệu thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tải file: " + e.getMessage());
        }
    }

   
    // 2. API LẤY DANH SÁCH TÀI LIỆU THEO LỚP
    @GetMapping("/materials/class/{classId}")
    public ResponseEntity<List<Material>> getMaterialsByClass(@PathVariable Long classId) {
        List<Material> materials = materialRepository.findByClassEntityIdOrderByUploadedAtDesc(classId);
        return ResponseEntity.ok(materials);
    }

    // 3. API TẢI XUỐNG FILE VẬT LÝ
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            // Lấy đường dẫn vật lý của file
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        // Set content type là dạng file stream để trình duyệt tự động tải xuống
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Không tìm thấy file!");
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}