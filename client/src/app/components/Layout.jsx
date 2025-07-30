"use client";

import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      {children}
    </>
  );
}
