package com.edulms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edulms.entity.TuitionPayment;
import com.edulms.entity.TuitionPaymentStatus;

@Repository
public interface TuitionPaymentRepository extends JpaRepository<TuitionPayment, Long> {
    List<TuitionPayment> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<TuitionPayment> findByStatusOrderByCreatedAtDesc(TuitionPaymentStatus status);
}
