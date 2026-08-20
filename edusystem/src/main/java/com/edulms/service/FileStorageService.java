package com.edulms.service;

import java.nio.file.Path;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeSubmissionFile(MultipartFile file);

    String storeAssignmentFile(MultipartFile file);

    String storeMaterialFile(MultipartFile file);

    Path getMaterialFilePath(String fileName);
}
