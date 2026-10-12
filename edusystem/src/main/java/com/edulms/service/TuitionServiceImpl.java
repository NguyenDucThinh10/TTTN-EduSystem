package com.edulms.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.edulms.dto.TuitionLineResponse;
import com.edulms.dto.TuitionPaymentRequest;
import com.edulms.dto.TuitionPaymentResponse;
import com.edulms.dto.TuitionSummaryResponse;
import com.edulms.entity.Enrollment;
import com.edulms.entity.Role;
import com.edulms.entity.TuitionPayment;
import com.edulms.entity.TuitionPaymentStatus;
import com.edulms.entity.User;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.TuitionPaymentRepository;
import com.edulms.repository.UserRepository;

@Service
public class TuitionServiceImpl implements TuitionService {

    private static final long TUITION_PER_CREDIT = 400000L;

    private final CurrentUserService currentUserService;
    private final EnrollmentRepository enrollmentRepository;
    private final TuitionPaymentRepository tuitionPaymentRepository;
    private final UserRepository userRepository;

    public TuitionServiceImpl(
            CurrentUserService currentUserService,
            EnrollmentRepository enrollmentRepository,
            TuitionPaymentRepository tuitionPaymentRepository,
            UserRepository userRepository) {
        this.currentUserService = currentUserService;
        this.enrollmentRepository = enrollmentRepository;
        this.tuitionPaymentRepository = tuitionPaymentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<TuitionSummaryResponse> getAllStudentSummaries() {
        return userRepository.findByRole(Role.STUDENT).stream()
                .map(this::buildSummary)
                .toList();
    }

    @Override
    public TuitionSummaryResponse getMySummary() {
        return buildSummary(currentUserService.getCurrentUser());
    }

    @Override
    public TuitionSummaryResponse getStudentSummary(Long studentId) {
        return buildSummary(findStudent(studentId));
    }

    @Override
    public TuitionPaymentResponse createPaymentRequest(TuitionPaymentRequest request) {
        User student = currentUserService.getCurrentUser();
        validatePaymentAmount(request.getAmount());
        TuitionPayment payment = new TuitionPayment();
        payment.setStudent(student);
        payment.setAmount(request.getAmount());
        payment.setNote(request.getNote());
        payment.setStatus(TuitionPaymentStatus.PENDING);
        return mapPayment(tuitionPaymentRepository.save(payment));
    }

    @Override
    public TuitionPaymentResponse adminRecordPayment(TuitionPaymentRequest request) {
        User admin = currentUserService.getCurrentUser();
        User student = findStudent(request.getStudentId());
        validatePaymentAmount(request.getAmount());
        TuitionPayment payment = new TuitionPayment();
        payment.setStudent(student);
        payment.setAmount(request.getAmount());
        payment.setNote(request.getNote());
        payment.setStatus(TuitionPaymentStatus.CONFIRMED);
        payment.setConfirmedAt(LocalDateTime.now());
        payment.setConfirmedBy(admin);
        return mapPayment(tuitionPaymentRepository.save(payment));
    }

    @Override
    public TuitionPaymentResponse confirmPayment(Long paymentId) {
        TuitionPayment payment = findPayment(paymentId);
        payment.setStatus(TuitionPaymentStatus.CONFIRMED);
        payment.setConfirmedAt(LocalDateTime.now());
        payment.setConfirmedBy(currentUserService.getCurrentUser());
        return mapPayment(tuitionPaymentRepository.save(payment));
    }

    @Override
    public TuitionPaymentResponse rejectPayment(Long paymentId) {
        TuitionPayment payment = findPayment(paymentId);
        payment.setStatus(TuitionPaymentStatus.REJECTED);
        payment.setConfirmedAt(LocalDateTime.now());
        payment.setConfirmedBy(currentUserService.getCurrentUser());
        return mapPayment(tuitionPaymentRepository.save(payment));
    }

    @Override
    public void deletePayment(Long paymentId) {
        TuitionPayment payment = findPayment(paymentId);
        tuitionPaymentRepository.delete(payment);
    }

    private TuitionSummaryResponse buildSummary(User student) {
        List<TuitionLineResponse> lines = enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(this::mapLine)
                .toList();
        List<TuitionPaymentResponse> payments = tuitionPaymentRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(this::mapPayment)
                .toList();

        long totalCredits = lines.stream().mapToLong(line -> line.getCredits() == null ? 0 : line.getCredits()).sum();
        long totalAmount = lines.stream().mapToLong(line -> line.getAmount() == null ? 0 : line.getAmount()).sum();
        long paidAmount = payments.stream()
                .filter(payment -> TuitionPaymentStatus.CONFIRMED.name().equals(payment.getStatus()))
                .mapToLong(TuitionPaymentResponse::getAmount)
                .sum();
        long pendingAmount = payments.stream()
                .filter(payment -> TuitionPaymentStatus.PENDING.name().equals(payment.getStatus()))
                .mapToLong(TuitionPaymentResponse::getAmount)
                .sum();
        long debtAmount = Math.max(totalAmount - paidAmount, 0);

        TuitionSummaryResponse response = new TuitionSummaryResponse();
        response.setStudentId(student.getId());
        response.setStudentName(student.getFullName() != null ? student.getFullName() : student.getUsername());
        response.setTotalCredits(totalCredits);
        response.setTotalAmount(totalAmount);
        response.setPaidAmount(paidAmount);
        response.setPendingAmount(pendingAmount);
        response.setDebtAmount(debtAmount);
        response.setStatus(debtAmount == 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "UNPAID");
        response.setLines(lines);
        response.setPayments(payments);
        return response;
    }

    private TuitionLineResponse mapLine(Enrollment enrollment) {
        var classEntity = enrollment.getClassEntity();
        var course = classEntity.getCourse();
        int credits = course.getCredits() == null ? 0 : course.getCredits();

        TuitionLineResponse response = new TuitionLineResponse();
        response.setClassId(classEntity.getId());
        response.setClassName(classEntity.getName());
        response.setSemester(classEntity.getSemester());
        response.setCourseId(course.getId());
        response.setCourseCode(course.getCode());
        response.setCourseTitle(course.getTitle());
        response.setCredits(credits);
        response.setAmount(credits * TUITION_PER_CREDIT);
        return response;
    }

    private TuitionPaymentResponse mapPayment(TuitionPayment payment) {
        TuitionPaymentResponse response = new TuitionPaymentResponse();
        response.setId(payment.getId());
        response.setStudentId(payment.getStudent().getId());
        response.setStudentName(payment.getStudent().getFullName() != null ? payment.getStudent().getFullName() : payment.getStudent().getUsername());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus().name());
        response.setNote(payment.getNote());
        response.setCreatedAt(payment.getCreatedAt());
        response.setConfirmedAt(payment.getConfirmedAt());
        response.setConfirmedByName(payment.getConfirmedBy() == null ? null : payment.getConfirmedBy().getFullName());
        return response;
    }

    private User findStudent(Long studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Vui long chon sinh vien");
        }
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay sinh vien"));
        if (student.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("Nguoi dung duoc chon khong phai sinh vien");
        }
        return student;
    }

    private TuitionPayment findPayment(Long paymentId) {
        return tuitionPaymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay giao dich hoc phi"));
    }

    private void validatePaymentAmount(Long amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("So tien nop phai lon hon 0");
        }
    }
}
