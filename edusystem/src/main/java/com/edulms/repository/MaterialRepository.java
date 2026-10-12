package com.edulms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edulms.entity.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    
    // Tìm toàn bộ tài liệu thuộc về 1 Lớp học (classId) và sắp xếp giảm dần theo thời gian upload (mới nhất lên đầu)
    List<Material> findByClassEntityIdOrderByUploadedAtDesc(Long classId);
    
}