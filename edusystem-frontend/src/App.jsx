import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom'; 

// Import các trang giao diện 
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
//import TeacherDashboard from './pages/TeacherDashboard';
//import StudentDashboard from './pages/StudentDashboard';
const TeacherDashboard = () => <div style={{padding: 50}}><h2>Trang Giảng Viên đang xây dựng...</h2></div>;
const StudentDashboard = () => <div style={{padding: 50}}><h2>Trang Học Viên đang xây dựng...</h2></div>;

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang công khai: Đăng nhập / Đăng ký */}
                <Route path="/" element={<AuthPage />} />

                {/* Trang dành riêng cho ADMIN */}
                <Route 
                    path="/admin/*" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                >
                    {/* --- BỔ SUNG: CÁC ROUTE CON CỦA ADMIN --- */}
                    {/* Các component này sẽ được chèn tự động vào vị trí của <Outlet /> trong AdminDashboard */}
                    <Route path="users" element={<UserManagement />} />
                    <Route path="classes" element={<h2>Bảng Quản lý Lớp học sẽ nằm ở đây</h2>} />
                </Route>

                {/* Trang dành riêng cho GIẢNG VIÊN */}
                <Route 
                    path="/teacher/*" 
                    element={
                        <ProtectedRoute allowedRoles={['TEACHER']}>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    } 
                >
                    {/* Có thể thêm các route con cho Teacher ở đây sau này */}
                </Route>

                {/* Trang dành riêng cho HỌC VIÊN */}
                <Route 
                    path="/student/*" 
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                >
                    {/* Có thể thêm các route con cho Student ở đây sau này */}
                </Route>

                {/* --- BỔ SUNG: ROUTE DỰ PHÒNG (FALLBACK) --- */}
                {/* Bắt mọi đường dẫn nhập sai hoặc không tồn tại và đẩy về trang đăng nhập */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;