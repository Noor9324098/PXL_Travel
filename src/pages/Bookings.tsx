import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plane, Calendar, Clock, Phone, CreditCard } from "lucide-react";

interface Booking {
  id: string;
  flight_origin: string;
  flight_destination: string;
  flight_date: string;
  passenger_name: string;
  phone_number: string;
  transaction_number: string;
  status: string;
  created_at: string;
}

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to view your bookings");
        navigate("/auth");
        return;
      }
      fetchBookings();
    };

    checkAuth();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and track your flight booking requests</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">Start searching for flights to make your first booking</p>
                <button
                  onClick={() => navigate("/search")}
                  className="text-primary hover:underline font-medium"
                >
                  Search Flights
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <Card 
                  key={booking.id} 
                  className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-medium animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-display text-xl flex items-center gap-2">
                        <Plane className="w-5 h-5 text-primary" />
                        {booking.flight_origin} → {booking.flight_destination}
                      </CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Flight Date</p>
                          <p className="font-semibold">{new Date(booking.flight_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="font-semibold">{booking.phone_number}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction</p>
                          <p className="font-semibold">{booking.transaction_number}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-semibold">{new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Passenger Name</p>
                      <p className="font-semibold">{booking.passenger_name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;
