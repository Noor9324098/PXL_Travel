import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, Bus, Shield, ArrowRight } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage local flights and urban transportation services
              </p>
            </div>

            {/* Admin Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Flights Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-hero-end rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-2xl">Local Flights</CardTitle>
                      <CardDescription>Add and manage local flight routes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create new local flight entries with departure and arrival details, pricing, and schedules.
                  </p>
                  <Button 
                    onClick={() => navigate("/admin/local-flights")}
                    className="w-full group"
                  >
                    Manage Local Flights
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Urban Transportation Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-hero-end rounded-lg flex items-center justify-center">
                      <Bus className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-2xl">Urban Transportation</CardTitle>
                      <CardDescription>Add and manage bus and urban transport routes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Create new bus and urban transportation routes with schedules, pricing, and route details.
                  </p>
                  <Button 
                    onClick={() => navigate("/admin/urban-transportation")}
                    className="w-full group"
                  >
                    Manage Urban Transportation
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

