import { Button } from "@/components/ui/button";
import { User, LogOut, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleInternationalFlights = () => {
    navigate("/search");
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
                  className="bg-gradient-to-r from-primary to-hero-end hover:from-primary/90 hover:to-hero-end/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-semibold px-6 py-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <div className="menu-wrapper">
              <button className="menu-btn" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
              <div className="radial-menu">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={handleHome}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={handleInternationalFlights}
                >
                  International Flights
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                >
                  Local Flights
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                >
                  Buses And Urban Transportation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                >
                  Special Offers
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                >
                  FAQ
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-white hover:bg-white/10"
                  onClick={handleHowItWorks}
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
