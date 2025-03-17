import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; 
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("🔴 No token found. Redirecting to login.");
          setUser(null);
          setLoading(false);
          return;
        }

        
        const response = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🟢 User logged in:", response.data);
        setUser(response.data as User);
      } catch (error) {
        console.error("🔴 Auth Check Failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    console.log("🔴 Logging out...");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
