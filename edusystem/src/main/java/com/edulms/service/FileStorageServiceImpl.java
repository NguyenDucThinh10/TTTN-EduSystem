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
    private final Path uploadDir;

    public FileStorageServiceImpl(@Value("${edulms.upload.submissions-dir:uploads/submissions}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @Override
    public String storeSubmissionFile(MultipartFile file) {
        try {
            Files.createDirectories(uploadDir);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "submission" : file.getOriginalFilename());
            String filename = UUID.randomUUID() + "-" + originalName;
            Path target = uploadDir.resolve(filename).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new InvalidFileException("Tên file không hợp lệ");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/submissions/" + filename;
        } catch (IOException ex) {
            throw new InvalidFileException("Không thể lưu file bài nộp");
        }
    }
}
