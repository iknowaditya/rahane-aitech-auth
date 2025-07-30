"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) setUser(JSON.parse(userRaw));
    else setUser(null);
  }, []);

  const login = (userObj, token) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("token", token);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
