import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import Logo from "./Logo";

const validSkillLevels = ["beginner", "intermediate", "advanced"];

const signupSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  skill_level: yup
    .string()
    .oneOf(validSkillLevels, "Invalid skill level selected") 
    .required("Skill level is required"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const { setUser } = useContext(AuthContext);

  const handleSignUp = async (data: unknown) => {
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      // ✅ Save token to localStorage
      localStorage.setItem("token", result.token);

      // ✅ Immediately update AuthContext user state
      setUser(result.user); // 🚀 Updates user state before navigation

      // ✅ Ensure navigation happens AFTER setting the token and user state
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)){
      setErrorMessage(error.message);
      }
      
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <Logo/>
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
        <div>
          <Input type="text" placeholder="Full Name" {...register("name")} />
          <p className="text-red-500 text-xs">{errors.name?.message}</p>
        </div>
        <div>
          <Input type="text" placeholder="Username" {...register("username")} />
          <p className="text-red-500 text-xs">{errors.username?.message}</p>
        </div>
        <div>
          <Input type="email" placeholder="Email" {...register("email")} />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill Level
          </label>
          <select
            {...register("skill_level")}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="">Select a skill level</option>
            {validSkillLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs">{errors.skill_level?.message}</p>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
