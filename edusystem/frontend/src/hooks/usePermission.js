import { useAuth } from "./useAuth";
export const usePermission = (allowedRoles = []) => {
  const { user } = useAuth();
  return allowedRoles.length === 0 || allowedRoles.includes(user?.role);
};
