import { Navigate, Route, Routes } from "react-router-dom";
import { ROLES } from "../constants/roles";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import ProfilePage from "../pages/auth/ProfilePage";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import ServerErrorPage from "../pages/error/ServerErrorPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserListPage from "../pages/admin/users/UserListPage";
import UserCreatePage from "../pages/admin/users/UserCreatePage";
import UserDetailPage from "../pages/admin/users/UserDetailPage";
import UserEditPage from "../pages/admin/users/UserEditPage";
import SemesterListPage from "../pages/admin/semesters/SemesterListPage";
import SemesterFormPage from "../pages/admin/semesters/SemesterFormPage";
import CourseListPage from "../pages/admin/courses/CourseListPage";
import CourseCreatePage from "../pages/admin/courses/CourseCreatePage";
import CourseDetailPage from "../pages/admin/courses/CourseDetailPage";
import ClassroomListPage from "../pages/admin/classrooms/ClassroomListPage";
import ClassroomCreatePage from "../pages/admin/classrooms/ClassroomCreatePage";
import ClassroomDetailPage from "../pages/admin/classrooms/ClassroomDetailPage";
import ClassroomEditPage from "../pages/admin/classrooms/ClassroomEditPage";
import EnrollmentManagementPage from "../pages/admin/classrooms/EnrollmentManagementPage";
import SystemReportPage from "../pages/admin/reports/SystemReportPage";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import TeacherClassroomsPage from "../pages/teacher/MyClassroomsPage";
import TeacherClassroomDetailPage from "../pages/teacher/classroom/TeacherClassroomDetailPage";
import TeacherStudentListPage from "../pages/teacher/classroom/StudentListPage";
import TeacherClassroomProgressPage from "../pages/teacher/classroom/ClassroomProgressPage";
import MaterialListPage from "../pages/teacher/materials/MaterialListPage";
import MaterialCreatePage from "../pages/teacher/materials/MaterialCreatePage";
import MaterialEditPage from "../pages/teacher/materials/MaterialEditPage";
import AssignmentListPage from "../pages/teacher/assignments/AssignmentListPage";
import AssignmentCreatePage from "../pages/teacher/assignments/AssignmentCreatePage";
import AssignmentDetailPage from "../pages/teacher/assignments/AssignmentDetailPage";
import AssignmentEditPage from "../pages/teacher/assignments/AssignmentEditPage";
import SubmissionListPage from "../pages/teacher/submissions/SubmissionListPage";
import SubmissionDetailPage from "../pages/teacher/submissions/SubmissionDetailPage";
import GradeManagementPage from "../pages/teacher/grades/GradeManagementPage";
import GradeComponentPage from "../pages/teacher/grades/GradeComponentPage";
import FinalGradePage from "../pages/teacher/grades/FinalGradePage";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentClassroomsPage from "../pages/student/MyClassroomsPage";
import StudentClassroomDetailPage from "../pages/student/classroom/StudentClassroomDetailPage";
import ClassroomMaterialPage from "../pages/student/classroom/ClassroomMaterialPage";
import StudentClassroomProgressPage from "../pages/student/classroom/ClassroomProgressPage";
import StudentAssignmentListPage from "../pages/student/assignments/StudentAssignmentListPage";
import StudentAssignmentDetailPage from "../pages/student/assignments/StudentAssignmentDetailPage";
import SubmitAssignmentPage from "../pages/student/assignments/SubmitAssignmentPage";
import StudentGradePage from "../pages/student/grades/StudentGradePage";
import StudentProgressPage from "../pages/student/grades/StudentProgressPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/create" element={<UserCreatePage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="users/:id/edit" element={<UserEditPage />} />
            <Route path="semesters" element={<SemesterListPage />} />
            <Route path="semesters/form" element={<SemesterFormPage />} />
            <Route path="courses" element={<CourseListPage />} />
            <Route path="courses/create" element={<CourseCreatePage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="classrooms" element={<ClassroomListPage />} />
            <Route path="classrooms/create" element={<ClassroomCreatePage />} />
            <Route path="classrooms/:id" element={<ClassroomDetailPage />} />
            <Route path="classrooms/:id/edit" element={<ClassroomEditPage />} />
            <Route path="classrooms/:id/enrollments" element={<EnrollmentManagementPage />} />
            <Route path="reports" element={<SystemReportPage />} />
          </Route>
        </Route>
        <Route element={<RoleRoute roles={[ROLES.TEACHER]} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboardPage />} />
            <Route path="classrooms" element={<TeacherClassroomsPage />} />
            <Route path="classrooms/:id" element={<TeacherClassroomDetailPage />} />
            <Route path="classrooms/:id/students" element={<TeacherStudentListPage />} />
            <Route path="classrooms/:id/progress" element={<TeacherClassroomProgressPage />} />
            <Route path="materials" element={<MaterialListPage />} />
            <Route path="materials/create" element={<MaterialCreatePage />} />
            <Route path="materials/:id/edit" element={<MaterialEditPage />} />
            <Route path="assignments" element={<AssignmentListPage />} />
            <Route path="assignments/create" element={<AssignmentCreatePage />} />
            <Route path="assignments/:id" element={<AssignmentDetailPage />} />
            <Route path="assignments/:id/edit" element={<AssignmentEditPage />} />
            <Route path="submissions" element={<SubmissionListPage />} />
            <Route path="submissions/:id" element={<SubmissionDetailPage />} />
            <Route path="grades" element={<GradeManagementPage />} />
            <Route path="grades/components" element={<GradeComponentPage />} />
            <Route path="grades/final" element={<FinalGradePage />} />
          </Route>
        </Route>
        <Route element={<RoleRoute roles={[ROLES.STUDENT]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="classrooms" element={<StudentClassroomsPage />} />
            <Route path="classrooms/:id" element={<StudentClassroomDetailPage />} />
            <Route path="classrooms/:id/materials" element={<ClassroomMaterialPage />} />
            <Route path="classrooms/:id/progress" element={<StudentClassroomProgressPage />} />
            <Route path="assignments" element={<StudentAssignmentListPage />} />
            <Route path="assignments/:id" element={<StudentAssignmentDetailPage />} />
            <Route path="assignments/:id/submit" element={<SubmitAssignmentPage />} />
            <Route path="grades" element={<StudentGradePage />} />
            <Route path="grades/progress" element={<StudentProgressPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
