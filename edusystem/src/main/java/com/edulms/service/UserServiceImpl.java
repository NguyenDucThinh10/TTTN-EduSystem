package com.edulms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder; // import enum UserStatus nếu dự án có
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

    // Inject thêm PasswordEncoder vào constructor
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
            return response;
        });
    }

    @Override
    public UserResponse changeUserStatus(Long id, UserStatus newStatus) {
        // 1. Tìm User theo ID, nếu không thấy thì ném lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy người dùng với ID: " + id));

        // 2. Cập nhật trạng thái mới
        user.setStatus(newStatus);

        // 3. Lưu vào Database
        User savedUser = userRepository.save(user);

        // 4. Map dữ liệu trả về DTO
        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        response.setStatus(savedUser.getStatus()); // Map thêm status

        return response;
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        // 1. Kiểm tra xem username hoặc email đã tồn tại chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Lỗi: Username đã tồn tại!");
        }

        // 2. Khởi tạo đối tượng User mới từ request
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        
        // BẮT BUỘC: Mã hóa mật khẩu bằng BCrypt
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Set trạng thái mặc định nếu có dùng enum UserStatus
        // user.setStatus(UserStatus.ACTIVE);

        // 3. Lưu vào Database
        User savedUser = userRepository.save(user);

        // 4. Trả về thông tin UserResponse (DTO)
        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());
        return response;
    }
}