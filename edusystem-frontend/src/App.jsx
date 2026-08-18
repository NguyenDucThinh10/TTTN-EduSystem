import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Trang công khai & Bảo mật
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// Các trang (Components) của Admin
import AdminDashboard from './components/AdminDashboard'; // Đây là Khung Layout có Menu
import DashboardOverview from './components/DashboardOverview'; // Đây là trang Biểu đồ KPIs mới
import UserManagement from './components/UserManagement';
import ClassManagement from './components/ClassManagement';

// Các trang tạm thời (Placeholder)
const TeacherDashboard = () => <div style={{padding: 50}}><h2>Trang Giảng Viên đang xây dựng...</h2></div>;
const StudentDashboard = () => <div style={{padding: 50}}><h2>Trang Học Viên đang xây dựng...</h2></div>;

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang công khai: Đăng nhập / Đăng ký */}
                <Route path="/" element={<AuthPage />} />

                {/* Trang dành riêng cho ADMIN */}
                {/* LƯU Ý: Đã bỏ dấu /* sau /admin để Outlet và Index Route hoạt động chuẩn xác 100% */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                >
                    {/* TRANG MẶC ĐỊNH: Khi vào /admin, DashboardOverview (Biểu đồ) sẽ hiện ra ở Outlet */}
                    <Route index element={<DashboardOverview />} />
                    
                    {/* Các trang con khác */}
                    <Route path="users" element={<UserManagement />} />
                    <Route path="classes" element={<ClassManagement />} />
                </Route>

                {/* Trang dành riêng cho GIẢNG VIÊN */}
                <Route 
                    path="/teacher/*" 
                    element={
                        <ProtectedRoute allowedRoles={['TEACHER']}>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Trang dành riêng cho HỌC VIÊN */}
                <Route 
                    path="/student/*" 
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* ROUTE DỰ PHÒNG */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;