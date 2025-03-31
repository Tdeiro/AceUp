import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext";
import Logo from "./Logo";

// Define the form data type
interface IFormInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

// Define the schema
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
});

export default function SignUp() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    resolver: yupResolver(signupSchema),
  });

  const { setUser } = useContext(AuthContext);

  const handleSignUp: SubmitHandler<IFormInput> = async (data) => {
    setErrorMessage("");

    const payload = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      role: "player"
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      localStorage.setItem("token", result.token);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error: unknown) {
      // Error handling, make sure to assert the type of error
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <Logo />
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
        <Input type="text" placeholder="Full Name" {...register("name")} />
        <p className="text-red-500 text-xs">{errors.name?.message}</p>

        <Input type="text" placeholder="Username" {...register("username")} />
        <p className="text-red-500 text-xs">{errors.username?.message}</p>

        <Input type="email" placeholder="Email" {...register("email")} />
        <p className="text-red-500 text-xs">{errors.email?.message}</p>

        <Input type="password" placeholder="Password" {...register("password")} />
        <p className="text-red-500 text-xs">{errors.password?.message}</p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/")}>Log in</span>
      </p>
    </div>
  );
}
