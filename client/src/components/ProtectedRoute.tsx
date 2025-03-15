import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // ✅ Prevents flashing of login screen

  return user ? <>{children}</> : <Navigate to="/" replace />;
}
