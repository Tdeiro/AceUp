import { useEffect, useState, useContext } from "react";
import axiosInstance from "@/api/axiosInstance";
import AuthContext from "@/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { User } from "@/shared/Types";
import { ValidationError } from "yup";
import axios from "axios";




export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  // const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("🔵 Fetching user profile...");
        const response = await axiosInstance.get<User>("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("🟢 User profile fetched:", response.data);
        setProfile(response.data);
      } catch (error: unknown) {
        if (!(error instanceof ValidationError)) {
          throw error; 
        }
      
        console.error("🔴 Validation Error:", error);
      
        if (axios.isAxiosError(error)) {
          alert(
            "Failed to fetch profile: " +
              (error.response?.data?.message || error.message)
          );
        } else if (error instanceof Error) {
          alert("Failed to fetch profile: " + error.message);
        } else {
          alert("An unknown error occurred.");
        }
      }
        
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      {user && <h3 className="text-lg font-semibold">Welcome, {user.name}!</h3>}
      
      {profile ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Skill Level:</strong> {profile.skill_level}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}

      {/* <Button className="mt-4 bg-gray-600 hover:bg-gray-800" onClick={logout}>
        Logout
      </Button> */}
    </div>
  );
}
