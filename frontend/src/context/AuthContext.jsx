import { createContext, useState } from "react";
import { useThemeStore } from "../store/useThemeStore.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
  });

  const login = (token, role, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);

    setUser({ token, role, userId });
    useThemeStore.getState().initTheme(userId);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    useThemeStore.getState().clearTheme();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
