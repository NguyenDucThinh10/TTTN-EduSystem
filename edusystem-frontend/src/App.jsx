import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import các trang giao diện 
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

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
                />

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
            </Routes>
        </Router>
    );
}

export default App;