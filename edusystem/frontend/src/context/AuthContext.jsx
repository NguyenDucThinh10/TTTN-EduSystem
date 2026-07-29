import { createContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { ROLES } from "../constants/roles";
import { clearAuthStorage, getStoredUser, getToken, setStoredUser, setToken } from "../utils/tokenUtils";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setAuthToken] = useState(getToken());
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const nextUser = { username: response.username, role: response.role || ROLES.STUDENT };
    const nextToken = response.accessToken || response.token;
    setToken(nextToken);
    setStoredUser(nextUser);
    setAuthToken(nextToken);
    setUser(nextUser);
    return nextUser;
  };
  const logout = () => { clearAuthStorage(); setAuthToken(null); setUser(null); };
  const value = useMemo(() => ({ user, token, isAuthenticated: Boolean(token), login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
