package com.edulms.controller;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.entity.ClassEntity;
import com.edulms.entity.Material;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.MaterialRepository;
import com.edulms.repository.UserRepository;
import com.edulms.service.CurrentUserService;
import com.edulms.service.FileStorageService;
import com.edulms.service.FileValidator;
import com.edulms.service.ResourceNotFoundException;
import com.edulms.service.UnauthorizedClassAccessException;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    private final FileStorageService fileStorageService;
    private final FileValidator fileValidator;
    private final CurrentUserService currentUserService;
    private final MaterialRepository materialRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public FileController(
            FileStorageService fileStorageService,
            FileValidator fileValidator,
            CurrentUserService currentUserService,
            MaterialRepository materialRepository,
            ClassRepository classRepository,
            UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.fileValidator = fileValidator;
        this.currentUserService = currentUserService;
        this.materialRepository = materialRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/assignments")
    public ResponseEntity<Map<String, String>> uploadAssignmentFile(@RequestParam("file") MultipartFile file) {
        requireTeacherOrAdmin("Chi giang vien moi duoc upload file de bai");
        fileValidator.validate(file);
        String fileUrl = fileStorageService.storeAssignmentFile(file);
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        fileValidator.validate(file);
        String fileUrl = fileStorageService.storeAssignmentFile(file);
        return ResponseEntity.ok(Map.of(
                "fileUrl", fileUrl,
                "url", fileUrl,
                "fileName", fileUrl.substring(fileUrl.lastIndexOf('/') + 1)));
    }

    @PostMapping("/materials/upload")
    public ResponseEntity<Material> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("classId") Long classId,
            @RequestParam("uploaderId") Long uploaderId) {
        requireTeacherOrAdmin("Chi giang vien moi duoc upload tai lieu");
        fileValidator.validate(file);

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Lop hoc khong ton tai"));
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung khong ton tai"));
        String fileUrl = fileStorageService.storeMaterialFile(file);
        String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

        Material material = new Material();
        material.setTitle(title);
        material.setDescription(description);
        material.setFileName(fileName);
        material.setFileType(file.getContentType());
        material.setFileUrl(fileUrl);
        material.setClassEntity(classEntity);
        material.setUploader(uploader);
        material.setIsVisible(true);

        return ResponseEntity.ok(materialRepository.save(material));
    }

    @GetMapping("/materials/class/{classId}")
    public ResponseEntity<List<Material>> getMaterialsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(materialRepository.findByClassEntityIdOrderByUploadedAtDesc(classId));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getMaterialFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() && !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private void requireTeacherOrAdmin(String message) {
        Role role = currentUserService.getCurrentUser().getRole();
        if (role != Role.TEACHER && role != Role.ADMIN) {
            throw new UnauthorizedClassAccessException(message);
        }
    }
}
