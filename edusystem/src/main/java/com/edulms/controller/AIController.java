package com.edulms.controller;

import com.edulms.service.DocumentParserService;
import com.edulms.service.GeminiAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*") // Cho phép Frontend React gọi API mà không bị chặn CORS
public class AIController {

    @Autowired
    private DocumentParserService documentParserService;

    @Autowired
    private GeminiAIService geminiAIService;

    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(@RequestParam("file") MultipartFile file) {
        try {
            // Bước 1: Trích xuất nội dung chữ từ file PDF được upload
            String documentText = documentParserService.extractTextFromPdf(file);
            
            // Kiểm tra xem file có đọc được không
            if (documentText == null || documentText.trim().isEmpty() || documentText.startsWith("Lỗi:")) {
                return ResponseEntity.badRequest().body("Không thể trích xuất văn bản từ tệp này. Vui lòng thử tệp PDF khác chứa văn bản rõ ràng.");
            }

            // Bước 2: Truyền văn bản vào Gemini AI để sinh ra JSON chứa 10 câu hỏi
            String quizJson = geminiAIService.generateQuizFromText(documentText);
            
            // Bước 3: Trả thẳng mảng JSON về cho Frontend
            return ResponseEntity.ok(quizJson);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Đã xảy ra lỗi hệ thống khi tạo câu hỏi: " + e.getMessage());
        }
    }
}