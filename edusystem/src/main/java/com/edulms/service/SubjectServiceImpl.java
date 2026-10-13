package com.edulms.service;

import com.edulms.dto.SubjectRequest;
import com.edulms.dto.SubjectResponse;
import com.edulms.entity.Subject;
import com.edulms.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    private static final long TUITION_PER_CREDIT = 400000L;

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public SubjectResponse createSubject(SubjectRequest request) {
        Subject subject = new Subject();
        subject.setCode(request.getCode()); // Lấy code
        subject.setTitle(request.getTitle()); // Lấy title
        subject.setCredits(request.getCredits()); // Lấy credits

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    @Override
    public List<SubjectResponse> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Hàm phụ trợ map dữ liệu
    @Override
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay hoc phan"));
        subject.setCode(request.getCode());
        subject.setTitle(request.getTitle());
        subject.setCredits(request.getCredits());
        return mapToResponse(subjectRepository.save(subject));
    }

    @Override
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khong tim thay hoc phan");
        }
        subjectRepository.deleteById(id);
    }

    private SubjectResponse mapToResponse(Subject subject) {
        SubjectResponse response = new SubjectResponse();
        response.setId(subject.getId());
        response.setCode(subject.getCode());
        response.setTitle(subject.getTitle());
        response.setCredits(subject.getCredits());
        response.setTuitionFee((subject.getCredits() == null ? 0 : subject.getCredits()) * TUITION_PER_CREDIT);
        return response;
    }
}
