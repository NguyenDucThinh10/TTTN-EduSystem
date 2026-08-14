package com.edulms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.edulms.dto.ClassRequest;
import com.edulms.dto.ClassResponse;
import com.edulms.dto.UserResponse;
import com.edulms.entity.ClassEntity;
import com.edulms.entity.ClassStatus;
import com.edulms.entity.Course;
import com.edulms.entity.Enrollment;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.repository.ClassRepository;
import com.edulms.repository.CourseRepository;
import com.edulms.repository.EnrollmentRepository;
import com.edulms.repository.UserRepository;

@Service
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CurrentUserService currentUserService;

    public ClassServiceImpl(
            ClassRepository classRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            CurrentUserService currentUserService) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public ClassResponse createClass(ClassRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay mon hoc"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay giang vien"));

        ClassEntity newClass = new ClassEntity();
        newClass.setCourse(course);
        newClass.setTeacher(teacher);
        newClass.setName(request.getName());
        newClass.setSemester(request.getSemester());
        newClass.setStatus(request.getStatus() != null ? request.getStatus() : ClassStatus.ONGOING);

        return mapToResponse(classRepository.save(newClass));
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponse> getMyClasses() {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return getAllClasses();
        }
        if (user.getRole() == Role.TEACHER) {
            return classRepository.findByTeacherId(user.getId()).stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return enrollmentRepository.findByStudentId(user.getId()).stream()
                .map(enrollment -> mapToResponse(enrollment.getClassEntity()))
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponse getClassById(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        requireClassAccess(classEntity);
        return mapToResponse(classEntity);
    }

    @Override
    public ClassResponse updateClass(Long id, ClassRequest request) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay hoc phan"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay giang vien"));
        if (teacher.getRole() != Role.TEACHER) {
            throw new RuntimeException("Nguoi duoc phan cong khong phai giang vien");
        }

        classEntity.setCourse(course);
        classEntity.setTeacher(teacher);
        classEntity.setName(request.getName());
        classEntity.setSemester(request.getSemester());
        classEntity.setStatus(request.getStatus() != null ? request.getStatus() : ClassStatus.ONGOING);
        return mapToResponse(classRepository.save(classEntity));
    }

    @Override
    public List<UserResponse> getClassStudents(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));
        return enrollmentRepository.findByClassEntityId(classEntity.getId()).stream()
                .map(enrollment -> mapUserToResponse(enrollment.getStudent()))
                .collect(Collectors.toList());
    }

    @Override
    public void enrollStudentsToClass(Long classId, List<Long> studentIds) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));

        for (Long studentId : studentIds) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay sinh vien ID: " + studentId));

            if (student.getRole() != Role.STUDENT) {
                throw new RuntimeException("Nguoi dung ID " + studentId + " khong phai sinh vien");
            }

            if (!enrollmentRepository.existsByStudentIdAndClassEntityId(studentId, classId)) {
                Enrollment enrollment = new Enrollment();
                enrollment.setClassEntity(classEntity);
                enrollment.setStudent(student);
                enrollmentRepository.save(enrollment);
            }
        }
    }

    @Override
    public String enrollStudentsFromExcel(Long classId, MultipartFile file) {
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay lop hoc"));

        int successCount = 0;
        int duplicateCount = 0;
        int notFoundCount = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            List<Enrollment> enrollmentsToSave = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }

                String username = formatter.formatCellValue(row.getCell(0)).trim();
                if (username.isEmpty()) {
                    continue;
                }

                Optional<User> studentOpt = userRepository.findByUsername(username);
                if (studentOpt.isEmpty() || studentOpt.get().getRole() != Role.STUDENT) {
                    notFoundCount++;
                    continue;
                }

                User student = studentOpt.get();
                if (enrollmentRepository.existsByStudentIdAndClassEntityId(student.getId(), classId)) {
                    duplicateCount++;
                    continue;
                }

                Enrollment enrollment = new Enrollment();
                enrollment.setClassEntity(classEntity);
                enrollment.setStudent(student);
                enrollmentsToSave.add(enrollment);
                successCount++;
            }

            if (!enrollmentsToSave.isEmpty()) {
                enrollmentRepository.saveAll(enrollmentsToSave);
            }

            return String.format(
                    "Thanh cong! Da them moi %d sinh vien vao lop. Bo qua %d sinh vien da co san, %d khong tim thay/khong hop le.",
                    successCount,
                    duplicateCount,
                    notFoundCount);
        } catch (Exception e) {
            throw new RuntimeException("Loi doc file Excel: " + e.getMessage());
        }
    }

    @Override
    public void removeStudentFromClass(Long classId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findByClassEntityIdAndStudentId(classId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Sinh vien chua duoc ghi danh vao lop nay"));
        enrollmentRepository.delete(enrollment);
    }

    private void requireClassAccess(ClassEntity classEntity) {
        User user = currentUserService.getCurrentUser();
        if (user.getRole() == Role.ADMIN || classEntity.getTeacher().getId().equals(user.getId())) {
            return;
        }
        enrollmentRepository.findByClassEntityIdAndStudentId(classEntity.getId(), user.getId())
                .orElseThrow(() -> new UnauthorizedClassAccessException("Ban khong thuoc lop hoc nay"));
    }

    private ClassResponse mapToResponse(ClassEntity entity) {
        ClassResponse response = new ClassResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSemester(entity.getSemester());
        response.setStatus(entity.getStatus());
        response.setCourseId(entity.getCourse().getId());
        response.setCourseCode(entity.getCourse().getCode());
        response.setCourseTitle(entity.getCourse().getTitle());
        response.setCourseCredits(entity.getCourse().getCredits());
        response.setTeacherId(entity.getTeacher().getId());

        String teacherName = entity.getTeacher().getFullName();
        response.setTeacherName(teacherName != null ? teacherName : entity.getTeacher().getUsername());
        response.setStudentCount(enrollmentRepository.countByClassEntityId(entity.getId()));

        return response;
    }

    private UserResponse mapUserToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        return response;
    }
}
