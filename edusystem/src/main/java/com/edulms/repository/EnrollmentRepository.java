package com.edulms.repository;
import java.util.List;
import com.edulms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    // Kiểm tra xem sinh viên đã có trong lớp này chưa để tránh add trùng
    boolean existsByStudentIdAndClassEntityId(Long studentId, Long classId);
    List<Enrollment> findByClassEntityId(Long classId);
}