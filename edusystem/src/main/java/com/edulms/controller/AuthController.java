package com.edulms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

// ĐÃ XÓA @CrossOrigin(origins = "*") ở đây để tránh xung đột với SecurityConfig
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, 
                            JwtTokenProvider jwtTokenProvider, 
                            UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Thử xác thực tài khoản & mật khẩu
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2. Nếu thành công, lấy thông tin và tạo Token
            User user = userRepository.findByUsername(loginRequest.getUsername()).get();
            String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());

            return ResponseEntity.ok(new JwtAuthResponse(
                    token,
                    "Bearer",
                    user.getId(),
                    user.getUsername(),
                    user.getFullName(),
                    user.getRole().name()));
            
        } catch (AuthenticationException ex) {
            // BẮT LỖI: Trả về mã 401 Unauthorized thay vì 403 Forbidden nếu sai mật khẩu
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CreateUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tài khoản đã tồn tại!");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        Role requestedRole = request.getRole() == null ? Role.STUDENT : request.getRole();
        if (requestedRole == Role.ADMIN) {
            return ResponseEntity.badRequest().body("Khong the dang ky tai khoan quan tri vien!");
        }

        newUser.setRole(requestedRole); 
        newUser.setStatus(UserStatus.ACTIVE); 

        userRepository.save(newUser);

        return ResponseEntity.ok("Đăng ký thành công!");
    }
}
