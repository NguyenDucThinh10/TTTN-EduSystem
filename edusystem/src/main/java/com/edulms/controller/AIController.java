package com.edulms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.service.DocumentParserService;
import com.edulms.service.GeminiAIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*") // Cho phép Frontend React gọi API
public class AIController {

    @Autowired
    private DocumentParserService documentParserService;

    @Autowired
    private GeminiAIService geminiAIService;

    // API 1: Tự động ra đề thi (Dành cho Giảng viên)
    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(@RequestParam("file") MultipartFile file) {
        try {
            String documentText = documentParserService.extractTextFromPdf(file);
            
            if (documentText == null || documentText.trim().isEmpty() || documentText.startsWith("Lỗi:")) {
                return ResponseEntity.badRequest().body("Không thể trích xuất văn bản từ tệp này. Vui lòng thử tệp PDF khác.");
            }

            String quizJson = geminiAIService.generateQuizFromText(documentText);
            return ResponseEntity.ok(quizJson);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Đã xảy ra lỗi hệ thống khi tạo câu hỏi: " + e.getMessage());
        }
    }

    // API 2: Trợ giảng Ảo (Dành cho Sinh viên)
    @PostMapping("/ask-tutor")
    public ResponseEntity<?> askTutor(
            @RequestParam("file") MultipartFile file,
            @RequestParam("question") String question) {
        try {
            // IN LOG RA CONSOLE ĐỂ BẮT LỖI
            System.out.println("=== NHẬN YÊU CẦU TỪ TRỢ GIẢNG AI ===");
            System.out.println("Tên file nhận được: " + file.getOriginalFilename());
            System.out.println("Câu hỏi nhận được: " + question);

            String documentText = documentParserService.extractTextFromPdf(file);
            
            // IN THẲNG KẾT QUẢ ĐỂ BẮT TẬN TAY LỖI NẰM Ở ĐÂU
            System.out.println("--- CHI TIẾT TRẢ VỀ TỪ THƯ VIỆN PDF ---");
            System.out.println(documentText);
            System.out.println("---------------------------------------");
            
            if (documentText == null || documentText.trim().isEmpty()) {
                System.out.println("LỖI: File PDF trống hoặc thư viện không đọc được chữ.");
                return ResponseEntity.badRequest().body("Lỗi: File PDF trống hoặc thư viện PDFBox không lấy được chữ.");
            }
            
            if (documentText.startsWith("Lỗi:")) {
                System.out.println("LỖI TỪ THƯ VIỆN PDFBOX: " + documentText);
                // TRẢ THẲNG CÂU LỖI ĐÓ VỀ FRONTEND ĐỂ HIỂN THỊ TRÊN KHUNG CHAT
                return ResponseEntity.badRequest().body("Chi tiết lỗi PDF: " + documentText);
            }

            System.out.println("Đọc file thành công! Đang gửi lên Gemini...");

            String answer = geminiAIService.askTutorWithContext(documentText, question);
            return ResponseEntity.ok(answer);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Lỗi hệ thống trợ giảng: " + e.getMessage());
        }
    }
}