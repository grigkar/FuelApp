import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, onLogout }: NavbarProps) => {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Fuel className="h-6 w-6 text-primary" />
          <span>FuelApp</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
