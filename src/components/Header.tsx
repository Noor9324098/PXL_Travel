import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, Shield } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAdmin } from "@/lib/admin";

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin?: boolean;
  is_super_admin?: boolean;
}

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleInternationalFlights = () => {
    navigate("/search");
  };

  const handleLocalFlights = () => {
    navigate("/local-flights");
  };

  const handleUrbanTransportation = () => {
    navigate("/urban-transportation");
  };

  const handleHowItWorks = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/icon.ico" alt="PXL Travel" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">PXL Travel</span>
          </Link>

          <nav className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin(user.email) && (
                  <Link to="/admin">
                    <Button variant="ghost" className="hover:bg-accent/50 transition-all duration-200 font-medium">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/bookings">
                  <Button variant="ghost" className="hover:bg-accent/50 transition-all duration-200 font-medium">
                    My Bookings
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200 font-medium mr-16"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="mr-16">
                <Button 
                  variant="default"
                  className="bg-[#DB7B21] hover:bg-[#c96e1d] text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold px-6 py-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <div className="menu-wrapper">
              <button 
                className={`menu-btn ${isMenuOpen ? 'active' : ''}`} 
                aria-label="Menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className={`rectangular-menu ${isMenuOpen ? 'open' : ''}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => { handleHome(); setIsMenuOpen(false); }}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => { handleInternationalFlights(); setIsMenuOpen(false); }}
                >
                  International Flights
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => { handleLocalFlights(); setIsMenuOpen(false); }}
                >
                  Local Flights
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => { handleUrbanTransportation(); setIsMenuOpen(false); }}
                >
                  Buses And Urban Transportation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Special Offers
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={() => { handleHowItWorks(); setIsMenuOpen(false); }}
                >
                  How It Works
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
