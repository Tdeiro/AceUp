import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
import AuthContext from "@/context/AuthContext";
import { ADMIN } from "@/shared/Constants";

export default function Navbar({disableLogin = false}) {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-black to-gray-900 text-white shadow-md fixed top-0 left-0 z-50">

      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        <Link
          to="/"
          className="text-3xl font-bold tracking-wide hover:opacity-80 transition"
        >
         AceUp
        </Link>

        
        <NavigationMenu className="hidden md:flex space-x-6">
          <NavigationMenuList>
            {user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="hover:text-gray-300 transition"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/tournaments"
                      className="hover:text-gray-300 transition"
                    >
                      Tournaments
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {user.role === ADMIN && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/users/all"
                        className="hover:text-gray-300 transition"
                      >
                        Admin
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        
        <div className="hidden md:flex items-center">
      {user ? (
      <Button
        onClick={logout}
        variant="outline"
        className="text-indigo-800 border-white hover:bg-indigo-800 hover:text-white"
      >
        Logout
      </Button>
      ) : disableLogin ? (
        <span className="text-white text-xl font-bold">Connecting Players. Uniting the game.</span>
        // <span className="text-white text-xl font-bold">Play. Connect. Compete.</span>


      ) : (
        <Link to="/login">
          <Button className="bg-green-500 hover:bg-green-600">Login</Button>
        </Link>
      )}
    </div>

        
        <Button
          variant="ghost"
          className="md:hidden focus:outline-none text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </Button>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-indigo-800 p-4 space-y-3">
          <Link
            to="/"
            className="block text-white hover:text-gray-300 transition"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-gray-300 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/tournaments"
                className="block hover:text-gray-300 transition"
              >
                Tournaments
              </Link>
              {user.role === ADMIN && (
                <Link
                  to="/users/all"
                  className="block hover:text-gray-300 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
           {!user && (
            disableLogin ? (
              <span className="block text-gray-300">Login is disabled</span>
            ) : (
              <Link to="/login" className="block hover:text-gray-300 transition">
                Login
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
