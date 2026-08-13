import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang giao diện 
import ClassManagement from './components/ClassManagement';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';

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
                    {/* ĐÂY LÀ CHỖ ĐÃ FIX LỖI TRẮNG MÀN HÌNH - KHÔNG CÓ DẤU / Ở ĐẦU */}
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