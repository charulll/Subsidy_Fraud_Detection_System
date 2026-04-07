import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  aadhaarLast4?: string;
  aadhaar?: string;     // 🔴 full aadhaar add
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_CREDENTIALS = {
  email: "admin@subsidyportal.gov.in",
  password: "Admin@123",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Page reload pe user load karo
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // 🔴 persist
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");   // 🔴 clear
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
