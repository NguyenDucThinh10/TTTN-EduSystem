package com.edulms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edulms.dto.CreateUserRequest;
import com.edulms.dto.JwtAuthResponse;
import com.edulms.dto.LoginRequest;
import com.edulms.entity.Role;
import com.edulms.entity.User;
import com.edulms.entity.UserStatus;
import com.edulms.repository.UserRepository;
import com.edulms.security.JwtTokenProvider;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Khai báo thêm công cụ mã hóa mật khẩu

    // Đừng quên Inject PasswordEncoder vào Constructor
    public AuthController(AuthenticationManager authenticationManager, 
                          JwtTokenProvider jwtTokenProvider, 
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- 1. HÀM LOGIN (Cũ của bạn) ---
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).get();
        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(new JwtAuthResponse(token, "Bearer", user.getUsername(), user.getRole().name()));
    }

    // --- 2. HÀM REGISTER (Mới thêm vào để sửa lỗi 404) ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CreateUserRequest request) {
        // Kiểm tra xem username đã bị trùng trong Database chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tài khoản đã tồn tại!");
        }

        // Tạo tài khoản mới từ dữ liệu ReactJS gửi lên
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Cấp quyền mặc định cho người đăng ký tự do là Sinh viên (STUDENT)
        newUser.setRole(Role.STUDENT); 
        newUser.setStatus(UserStatus.ACTIVE); 

        // Lưu vào MySQL
        userRepository.save(newUser);

        return ResponseEntity.ok("Đăng ký thành công!");
    }
  }

}
