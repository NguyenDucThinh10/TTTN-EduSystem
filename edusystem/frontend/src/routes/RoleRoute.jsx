import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
export default function RoleRoute({ roles }) {
  return usePermission(roles) ? <Outlet /> : <Navigate to="/403" replace />;
}
