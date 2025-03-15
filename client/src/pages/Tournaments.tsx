import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Tournaments() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">🏆 Tournaments</h2>

      {/* Show "Add Tournament" button only for admins */}
      {user?.role === "admin" && (
        <div className="text-center mb-4">
          <Link to="/create-tournament">
            <Button className="bg-green-500 hover:bg-green-600">
              + Add Tournament
            </Button>
          </Link>
        </div>
      )}

      {/* Tournament List (Placeholder) */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
        <p>List of upcoming tournaments will be displayed here...</p>
      </div>
    </div>
  );
}
