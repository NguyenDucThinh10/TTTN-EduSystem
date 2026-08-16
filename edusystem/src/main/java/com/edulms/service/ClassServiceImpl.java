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
import com.edulms.entity.Course;
import com.edulms.entity.Enrollment;
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

    
    public ClassServiceImpl(ClassRepository classRepository, 
                            CourseRepository courseRepository, 
                            UserRepository userRepository,
                            EnrollmentRepository enrollmentRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public ClassResponse createClass(ClassRequest request) {
        // 1. Tìm Course và Teacher từ DB
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên"));

        // 2. Tạo ClassEntity
        ClassEntity newClass = new ClassEntity();
        newClass.setCourse(course);
        newClass.setTeacher(teacher);
        newClass.setName(request.getName());
        newClass.setSemester(request.getSemester());
        newClass.setStatus(request.getStatus());

        // 3. Lưu vào database
        ClassEntity savedClass = classRepository.save(newClass);
        return mapToResponse(savedClass);
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Hàm phụ trợ map dữ liệu
    private ClassResponse mapToResponse(ClassEntity entity) {
        ClassResponse response = new ClassResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSemester(entity.getSemester());
        response.setStatus(entity.getStatus());
        response.setCourseTitle(entity.getCourse().getTitle()); // Lấy tên môn học
        
        // Ưu tiên hiển thị FullName, nếu null thì lấy Username
        String tName = entity.getTeacher().getFullName();
        response.setTeacherName(tName != null ? tName : entity.getTeacher().getUsername());
        
        return response;
    }

    @Override
    public void enrollStudentsToClass(Long classId, List<Long> studentIds) {
        // 1. Tìm lớp học
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));

        // 2. Duyệt danh sách sinh viên được truyền lên
        for (Long studentId : studentIds) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên ID: " + studentId));

            // 3. Nếu sinh viên chưa có trong lớp thì mới thêm vào (chống duplicate)
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
            // 1. Tìm lớp học
            ClassEntity classEntity = classRepository.findById(classId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));

            int successCount = 0;
            int duplicateCount = 0;
            int notFoundCount = 0;

            // 2. Mở và đọc file Excel
            try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);
                DataFormatter formatter = new DataFormatter();
                List<Enrollment> enrollmentsToSave = new ArrayList<>();

                for (Row row : sheet) {
                    if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề (Header)

                    // Lấy giá trị cột đầu tiên (Cột 0) là Username / Mã sinh viên
                    String username = formatter.formatCellValue(row.getCell(0)).trim();
                    if (username.isEmpty()) continue;

                    // 3. Tìm sinh viên trong DB theo Username
                    Optional<User> studentOpt = userRepository.findByUsername(username);
                    
                    if (studentOpt.isPresent()) {
                        User student = studentOpt.get();
                        
                        // Kiểm tra đúng là role STUDENT hay không
                        if (student.getRole() == com.edulms.entity.Role.STUDENT) {
                            // Kiểm tra xem đã có trong lớp chưa để tránh trùng lặp
                            boolean exists = enrollmentRepository.existsByStudentIdAndClassEntityId(student.getId(), classId);
                            
                            if (!exists) {
                                Enrollment enrollment = new Enrollment();
                                enrollment.setClassEntity(classEntity);
                                enrollment.setStudent(student);
                                enrollmentsToSave.add(enrollment);
                                successCount++;
                            } else {
                                duplicateCount++;
                            }
                        } else {
                            notFoundCount++;
                        }
                    } else {
                        notFoundCount++;
                    }
                }

                // 4. Lưu danh sách vào Database
                if (!enrollmentsToSave.isEmpty()) {
                    enrollmentRepository.saveAll(enrollmentsToSave);
                }

                // Trả về thông báo chi tiết kết quả để Frontend hiển thị cho người dùng biết
                return String.format("Thành công! Đã thêm mới %d sinh viên vào lớp. (Bỏ qua %d sinh viên đã có sẵn, %d không tìm thấy/không hợp lệ).", 
                        successCount, duplicateCount, notFoundCount);

            } catch (Exception e) {
                throw new RuntimeException("Lỗi đọc file Excel: " + e.getMessage());
            }
    }

    @Override
    public List<UserResponse> getStudentsByClass(Long classId) {
        classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học!"));

        List<Enrollment> enrollments = enrollmentRepository.findByClassEntityId(classId);
        
        return enrollments.stream().map(enrollment -> {
            User student = enrollment.getStudent();
            UserResponse res = new UserResponse();
            res.setId(student.getId());
            res.setUsername(student.getUsername());
            res.setFullName(student.getFullName());
            res.setEmail(student.getEmail());
            res.setRole(student.getRole());
            return res;
        }).collect(Collectors.toList());
    }
}