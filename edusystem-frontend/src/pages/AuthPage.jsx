import React, { useState } from 'react';
import './AuthPage.css';
import axiosClient from '../api/axiosClient'; // Import file cấu hình API của chúng ta

export default function AuthPage() {
    // State quản lý việc xoay form
    const [isActive, setIsActive] = useState(false);

    // 1. Khởi tạo State lưu trữ dữ liệu người dùng nhập vào Form Đăng Ký
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // 2. Hàm bắt sự kiện khi người dùng gõ phím
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    // 3. Hàm Xử lý khi bấm nút "Sign Up"
    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); // Chặn việc load lại trang web mặc định của form
        
        try {
            // Gọi API sang Spring Boot (Đảm bảo endpoint này khớp với AuthController của bạn)
            const response = await axiosClient.post('/api/auth/register', registerData);
            
            if(response) {
                alert("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.");
                // Chuyển form về lại mặt Login
                setIsActive(false); 
                // Xóa trắng form đăng ký
                setRegisterData({ username: '', email: '', password: '' });
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đăng ký thất bại! Vui lòng kiểm tra lại (có thể user đã tồn tại).");
        }
    };

    return (
        <div className="auth-container">
            <div className={`wrapper ${isActive ? 'active' : ''}`}>
                <span className="rotate-bg"></span>
                <span className="rotate-bg2"></span>

                {/* --- KHỐI FORM ĐĂNG NHẬP (Sẽ gắn API sau) --- */}
                <div className="form-box login">
                    <h2 className="title animation" style={{ '--i': 0, '--j': 21 }}>Login</h2>
                    <form>
                        <div className="input-box animation" style={{ '--i': 1, '--j': 22 }}>
                            <input type="text" required />
                            <label>Username</label>
                            <i className='bx bxs-user'></i>
                        </div>
                        <div className="input-box animation" style={{ '--i': 2, '--j': 23 }}>
                            <input type="password" required />
                            <label>Password</label>
                            <i className='bx bxs-lock-alt'></i>
                        </div>
                        <button type="submit" className="btn animation" style={{ '--i': 3, '--j': 24 }}>Login</button>
                        <div className="linkTxt animation" style={{ '--i': 5, '--j': 25 }}>
                            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(true); }}>Sign Up</a></p>
                        </div>
                    </form>
                </div>

                <div className="info-text login">
                    <h2 className="animation" style={{ '--i': 0, '--j': 20 }}>Welcome Back!</h2>
                    <p className="animation" style={{ '--i': 1, '--j': 21 }}>Đăng nhập vào hệ thống EduSystem để tiếp tục.</p>
                </div>

                {/* --- KHỐI FORM ĐĂNG KÝ (Đã gắn API) --- */}
                <div className="form-box register">
                    <h2 className="title animation" style={{ '--i': 17, '--j': 0 }}>Sign Up</h2>
                    {/* Bắn sự kiện onSubmit vào đây */}
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="input-box animation" style={{ '--i': 18, '--j': 1 }}>
                            {/* Thêm thuộc tính name, value và onChange */}
                            <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} required />
                            <label>Username</label>
                            <i className='bx bxs-user'></i>
                        </div>
                        <div className="input-box animation" style={{ '--i': 19, '--j': 2 }}>
                            <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required />
                            <label>Email</label>
                            <i className='bx bxs-envelope'></i>
                        </div>
                        <div className="input-box animation" style={{ '--i': 20, '--j': 3 }}>
                            <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required />
                            <label>Password</label>
                            <i className='bx bxs-lock-alt'></i>
                        </div>
                        <button type="submit" className="btn animation" style={{ '--i': 21, '--j': 4 }}>Sign Up</button>
                        <div className="linkTxt animation" style={{ '--i': 22, '--j': 5 }}>
                            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(false); }}>Login</a></p>
                        </div>
                    </form>
                </div>

                <div className="info-text register">
                    <h2 className="animation" style={{ '--i': 17, '--j': 0 }}>EduSystem</h2>
                    <p className="animation" style={{ '--i': 18, '--j': 1 }}>Đăng ký tài khoản để trải nghiệm nền tảng giáo dục tuyệt vời.</p>
                </div>
            </div>
        </div>
    );
}