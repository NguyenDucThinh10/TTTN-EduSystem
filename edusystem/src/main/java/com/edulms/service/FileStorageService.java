package com.edulms.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeSubmissionFile(MultipartFile file);

    String storeAssignmentFile(MultipartFile file);
}
