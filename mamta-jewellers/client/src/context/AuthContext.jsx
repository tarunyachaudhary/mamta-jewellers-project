import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("mj_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("mj_user", JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    persist(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data);
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post("/auth/admin-login", { email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mj_user");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put("/auth/profile", updates);
    persist(data);
    return data;
  };
  
  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    persist(data);
    return data;
  };


  const isAdmin = user?.role === "admin";

  return (
<AuthContext.Provider value={{ user, register, login, adminLogin, logout, isAdmin, updateProfile, verifyOtp }}>
  {children}
</AuthContext.Provider>
    
  );
};

export const useAuth = () => useContext(AuthContext);

