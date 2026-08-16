package com.edulms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // Thư mục lưu trữ file tạm thời trong project (thực tế có thể dùng AWS S3 hoặc thư mục ngoài)
    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Không thể tạo thư mục lưu trữ file.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Chuẩn hóa tên file
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Kiểm tra tên file có chứa ký tự không hợp lệ
            if(originalFileName.contains("..")) {
                throw new RuntimeException("Tên file chứa ký tự đường dẫn không hợp lệ: " + originalFileName);
            }

            // Tạo tên file duy nhất để không bị trùng lặp (tránh file tải lên sau đè file trước)
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file vào thư mục đích (thay thế nếu đã tồn tại)
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Trả về tên file đã lưu (Sau này dùng tên này để tạo link download)
            return newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Không thể lưu file " + originalFileName + ". Vui lòng thử lại!", ex);
        }
    }

    //  Hàm lấy đường dẫn vật lý của file để phục vụ việc Download
    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
}