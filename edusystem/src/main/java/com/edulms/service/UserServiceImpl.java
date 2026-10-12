package com.edulms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edulms.dto.CreateUserRequest;
import com.edulms.dto.UserResponse;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.map(user -> {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            response.setRole(user.getRole());
            // [QUAN TRỌNG] Phải có dòng này thì bảng trên Frontend mới hiện chữ ACTIVE/BLOCKED
            response.setStatus(user.getStatus()); 
            return response;
        });
    }

    @Override
    public UserResponse changeUserStatus(Long id, UserStatus newStatus) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy người dùng với ID: " + id));

        user.setStatus(newStatus);
        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        response.setStatus(savedUser.getStatus()); 

        return response;
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Lỗi: Username đã tồn tại!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Mặc định tạo tài khoản mới sẽ ở trạng thái ACTIVE
        user.setStatus(UserStatus.ACTIVE); 

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        // Trả về status để Frontend cập nhật ngay vào bảng
        response.setStatus(savedUser.getStatus()); 
        return response;
    }

    @Override
    public UserResponse updateUser(Long id, CreateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy người dùng với ID: " + id));

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        response.setStatus(savedUser.getStatus());
        
        return response;
    }

    @Override
    public void importUsersFromExcel(org.springframework.web.multipart.MultipartFile file) {
        try (org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(file.getInputStream())) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
            java.util.List<User> usersToSave = new java.util.ArrayList<>();
            org.apache.poi.ss.usermodel.DataFormatter formatter = new org.apache.poi.ss.usermodel.DataFormatter();

            for (org.apache.poi.ss.usermodel.Row row : sheet) {
                // Bỏ qua dòng đầu tiên (dòng tiêu đề: Username, FullName, Email)
                if (row.getRowNum() == 0) continue;

                String username = formatter.formatCellValue(row.getCell(0));
                String fullName = formatter.formatCellValue(row.getCell(1));
                String email = formatter.formatCellValue(row.getCell(2));

                // Bỏ qua nếu dòng trống
                if (username.isEmpty() || email.isEmpty()) continue;

                // Chỉ thêm vào danh sách nếu username chưa tồn tại trong DB
                if (userRepository.findByUsername(username).isEmpty()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setFullName(fullName);
                    user.setEmail(email);
                    user.setRole(com.edulms.entity.Role.STUDENT); // Mặc định là Sinh viên
                    user.setStatus(com.edulms.entity.UserStatus.ACTIVE);
                    user.setPasswordHash(passwordEncoder.encode("123456")); // Mật khẩu mặc định

                    usersToSave.add(user);
                }
            }

            // Lưu toàn bộ danh sách 100 sinh viên vào DB trong 1 lần
            if (!usersToSave.isEmpty()) {
                userRepository.saveAll(usersToSave);
            }

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }
    }
}
