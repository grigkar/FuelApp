import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel, LayoutDashboard, Car, History, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated = false, onLogout }: NavbarProps) => {
  const location = useLocation();
  
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vehicles", label: "Vehicles", icon: Car },
    { to: "/history", label: "History", icon: History },
    { to: "/statistics", label: "Statistics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-lg">
          <Fuel className="h-6 w-6 text-primary" />
          <span>FuelApp</span>
        </Link>
        
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("gap-2", isActive && "bg-secondary")}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
        
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
