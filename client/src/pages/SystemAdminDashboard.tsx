import { useEffect, useState, useContext } from "react";
import axiosInstance from "@/api/axiosInstance";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/shared/Types";


export default function SystemAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    if (!user) return undefined;

    if (user?.role !== "admin") {
      navigate("/dashboard"); 
    }
    const fetchUsers = async () => {
      try {
        console.log("🔵 Fetching users...");
        console.log(localStorage.getItem("token"));
        
        const response = await axiosInstance.get<User[]>("/user/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("🟢 Users fetched:", response.data);
        setUsers(response.data);
      } catch (error: any) {
        console.error(
          "🔴 Error fetching users:",
          error.response?.data || error
        );
        alert(
          "Failed to fetch users: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchUsers();
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Admin Dashboard</h2>
      <p>Welcome, {user?.name}! Here you can manage users.</p>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{u.name}</td>
              <td className="border border-gray-300 p-2">{u.username}</td>
              <td className="border border-gray-300 p-2">{u.email}</td>
              <td className="border border-gray-300 p-2">{u.role}</td>
              <td className="border border-gray-300 p-2">
                {u.role !== "system_admin" && (
                  <>
                    <Button
                      className="mr-2"
                      onClick={() => navigate(`/update-role/${u.id}`)}
                    >
                      Change Role
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-700"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="mt-4 bg-gray-600 hover:bg-gray-800" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}


const handleDelete = async (userId: string) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    await axiosInstance.delete(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    alert("User deleted successfully");
    window.location.reload();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
