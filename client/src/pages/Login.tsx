import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🔵 Logging in...");
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("🟢 Login successful:", response.data);

      
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); 

      
      if (response.data.user.role === "admin") {
        navigate("/users/all");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("🔴 Login error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to log in.");
    }

    
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
