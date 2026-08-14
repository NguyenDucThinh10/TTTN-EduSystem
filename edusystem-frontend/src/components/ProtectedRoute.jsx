import { Navigate, Outlet } from 'react-router-dom'; // BỔ SUNG: Import thêm Outlet

const normalizeRole = (role) => String(role || '').replace(/^ROLE_/, '').toUpperCase();

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = normalizeRole(localStorage.getItem('role'));
    const normalizedAllowedRoles = allowedRoles?.map(normalizeRole);

    // 1. Nếu chưa đăng nhập -> Chuyển hướng về trang Auth/Login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng vai trò không nằm trong danh sách được phép
    if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(userRole)) {
        // Đẩy về đúng trang theo Role hiện tại để tránh truy cập trái phép
        if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
        if (userRole === 'TEACHER') return <Navigate to="/teacher" replace />;
        return <Navigate to="/student" replace />;
    }

    // 3. Hợp lệ -> Cho phép vào trang
    // BỔ SUNG: Thêm `|| <Outlet />` để hỗ trợ cả cách viết bọc Component lẫn cách viết Route cha
    return children || <Outlet />;
};

export default ProtectedRoute;
