package com.edulms.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String generateQuizFromText(String documentText) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. KỸ THUẬT PROMPT: Ép AI trả về JSON chuẩn
        String prompt = "Bạn là một giảng viên đại học. Dựa vào nội dung tài liệu sau, hãy tạo 15 câu hỏi trắc nghiệm.\n" +
                        "YÊU CẦU BẮT BUỘC: Chỉ trả về dữ liệu dưới định dạng mảng JSON hợp lệ, tuyệt đối không chứa mã markdown (không dùng ký hiệu ```json), không có bất kỳ lời chào hỏi hay giải thích nào.\n" +
                        "Cấu trúc JSON yêu cầu:\n" +
                        "[\n  {\n    \"question\": \"Nội dung câu hỏi?\",\n    \"options\": [\"Đáp án A\", \"Đáp án B\", \"Đáp án C\", \"Đáp án D\"],\n    \"correctAnswer\": \"Đáp án đúng\"\n  }\n]\n\n" +
                        "Nội dung tài liệu:\n" + documentText;

        // 2. Xây dựng cấu trúc Body JSON gửi lên Google Gemini
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(parts));

        // 3. Setup Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // 4. Gọi API
        try {
            String fullUrl = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, requestEntity, Map.class);

            // 5. Bóc tách kết quả từ chuỗi JSON phức tạp mà Google trả về
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                
                String aiResponse = (String) resParts.get(0).get("text");

                // Bước dọn dẹp dự phòng: Lọc bỏ các thẻ markdown nếu AI "cứng đầu" vẫn trả về
                return aiResponse.replace("```json", "").replace("```", "").trim();
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Gemini API: " + e.getMessage());
        }
        
        // Trả về mảng JSON rỗng nếu có lỗi để Frontend không bị sập
        return "[]"; 
    }

    public String askTutorWithContext(String documentText, String userQuestion) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = "Bạn là một trợ giảng ảo thông minh, thân thiện và am hiểu học thuật. Dựa vào nội dung tài liệu học tập được cung cấp dưới đây, hãy giải đáp thắc mắc cho sinh viên một cách chính xác, súc tích và bám sát tài liệu.\n" +
                        "YÊU CẦU: Trình bày câu trả lời rõ ràng bằng định dạng Markdown.\n\n" +
                        "Nội dung tài liệu:\n" + documentText + "\n\n" +
                        "Câu hỏi từ sinh viên: " + userQuestion;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(parts));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            String fullUrl = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, requestEntity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                
                return (String) resParts.get(0).get("text");
            }
        } catch (Exception e) {
            System.err.println("Lỗi AI Tutor: " + e.getMessage());
        }
        return "Xin lỗi, trợ giảng AI đang gặp sự cố kết nối và chưa thể trả lời lúc này.";
    }
}