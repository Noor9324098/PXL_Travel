import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "@/lib/admin";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          toast.error("You must be signed in to access this page");
          navigate("/auth");
          return;
        }

        const user = JSON.parse(userStr);
        if (!isAdmin(user.email)) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("An error occurred while checking access");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

