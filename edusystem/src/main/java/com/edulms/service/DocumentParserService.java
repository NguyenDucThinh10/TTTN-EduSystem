package com.edulms.service;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentParserService {

    public String extractTextFromPdf(MultipartFile file) {
        // [ĐÃ SỬA LỖI]: Sử dụng Loader.loadPDF và đọc trực tiếp mảng byte từ MultipartFile
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
             
            PDFTextStripper pdfStripper = new PDFTextStripper();
            
            // Giới hạn chỉ đọc 5 trang đầu để tiết kiệm token API 
            pdfStripper.setStartPage(1);
            pdfStripper.setEndPage(5); 
            
            return pdfStripper.getText(document);
            
        } catch (IOException e) {
            e.printStackTrace();
            return "Lỗi: Không thể đọc nội dung tệp PDF này.";
        }
    }
}