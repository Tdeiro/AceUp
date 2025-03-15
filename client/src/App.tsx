import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import Navbar from "./components/ui/NavBar";
import Tournaments from "./pages/Tournaments";

function App() {
  const { user, loading } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      {user && <Navbar />}
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <Tournaments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/all"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <SystemAdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
