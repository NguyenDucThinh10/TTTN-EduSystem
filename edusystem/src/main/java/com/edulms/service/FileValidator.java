package com.edulms.service;

import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidator {
    private static final long MAX_SIZE = 20L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx", "zip", "rar", "txt", "png", "jpg", "jpeg");

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File khong duoc de trong");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new InvalidFileException("File khong duoc vuot qua 20MB");
        }
        if (!ALLOWED_EXTENSIONS.contains(extensionOf(file))) {
            throw new InvalidFileException("Dinh dang file khong hop le");
        }
    }

    private String extensionOf(MultipartFile file) {
        String filename = file.getOriginalFilename();
        return filename == null || !filename.contains(".")
                ? ""
                : filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
