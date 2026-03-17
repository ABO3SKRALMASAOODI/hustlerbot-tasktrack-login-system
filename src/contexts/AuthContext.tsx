import React, { createContext, ReactNode, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage and create demo account if needed
  useEffect(() => {
    // Create demo account if it doesn't exist
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (!users.some((u: { email: string }) => u.email === "demo@example.com")) {
      users.push({
        id: "demo-user",
        email: "demo@example.com",
        password: "demo123",
      });
      localStorage.setItem("users", JSON.stringify(users));
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: { email: string }) => u.email === email)) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
    };

    // Store password hash (in production, this would be server-side)
    users.push({ id: newUser.id, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Set current user
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userRecord = users.find(
      (u: { email: string; password: string }) => u.email === email && u.password === password
    );

    if (!userRecord) {
      throw new Error("Invalid email or password");
    }

    const currentUser: User = {
      id: userRecord.id,
      email: userRecord.email,
    };

    setUser(currentUser);
    localStorage.setItem("user", JSON.stringify(currentUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
