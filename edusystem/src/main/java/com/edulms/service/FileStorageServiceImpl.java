package com.edulms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private final Path submissionsDir;
    private final Path assignmentsDir;
    private final Path materialsDir;

    public FileStorageServiceImpl(
            @Value("${edulms.upload.submissions-dir:uploads/submissions}") String submissionsDir,
            @Value("${edulms.upload.assignments-dir:uploads/assignments}") String assignmentsDir,
            @Value("${edulms.upload.materials-dir:uploads/materials}") String materialsDir) {
        this.submissionsDir = Path.of(submissionsDir).toAbsolutePath().normalize();
        this.assignmentsDir = Path.of(assignmentsDir).toAbsolutePath().normalize();
        this.materialsDir = Path.of(materialsDir).toAbsolutePath().normalize();
    }

    @Override
    public String storeSubmissionFile(MultipartFile file) {
        return storeFile(file, submissionsDir, "/uploads/submissions/");
    }

    @Override
    public String storeAssignmentFile(MultipartFile file) {
        return storeFile(file, assignmentsDir, "/uploads/assignments/");
    }

    @Override
    public String storeMaterialFile(MultipartFile file) {
        return storeFile(file, materialsDir, "/api/files/download/");
    }

    @Override
    public Path getMaterialFilePath(String fileName) {
        Path filePath = materialsDir.resolve(fileName).normalize();
        if (!filePath.startsWith(materialsDir)) {
            throw new InvalidFileException("Ten file khong hop le");
        }
        return filePath;
    }

    private String storeFile(MultipartFile file, Path uploadDir, String publicPath) {
        try {
            Files.createDirectories(uploadDir);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
            String filename = UUID.randomUUID() + "-" + originalName;
            Path target = uploadDir.resolve(filename).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new InvalidFileException("Ten file khong hop le");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return publicPath + filename;
        } catch (IOException ex) {
            throw new InvalidFileException("Khong the luu file");
        }
    }
}
