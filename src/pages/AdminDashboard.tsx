import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, Bus, Shield, ArrowRight, ClipboardList, Users, Activity } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SpeedInsights } from "@vercel/speed-insights/react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "rgba(219, 123, 33, 0.1)",
        }}
      >
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
                Manage users, bookings, local flights, and urban transportation services
              </p>
            </div>

            {/* Admin Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Flights Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center">
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
                    <div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center">
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

              {/* Admin Bookings Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-2xl">Admin Bookings</CardTitle>
                      <CardDescription>Add, update, confirm, or delete bookings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage all customer booking requests and quickly switch status from pending to booked.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/bookings")}
                    className="w-full group"
                  >
                    Manage Bookings
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Users Management Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-2xl">Users Management</CardTitle>
                      <CardDescription>View registered users and contact details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Browse all users with full names and email addresses in one centralized admin view.
                  </p>
                  <Button
                    onClick={() => navigate("/admin/users")}
                    className="w-full group"
                  >
                    View Users
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Speed Insights Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-large md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-2xl">Vercel Speed Insights</CardTitle>
                      <CardDescription>Real-time performance monitoring and analytics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 rounded-xl p-6 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-muted-foreground">
                      Vercel Speed Insights is active. Performance data is being collected and analyzed in real-time.
                    </p>
                    <SpeedInsights />
                    <a 
                      href="https://vercel.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      View Detailed Metrics on Vercel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </div>
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

