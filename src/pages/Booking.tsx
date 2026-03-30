import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
// import {FlightCard} from "@/components/ui/FlightCard"
import { Loader2, Upload, Plane, User, Phone, CreditCard, FileText } from "lucide-react";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";

const bookingSchema = z.object({
  passengerFirstName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  passengerLastName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  phoneNumber: z.string().trim().min(10, { message: "Phone number must be at least 10 digits" }).max(20),
  transactionNumber: z.string().trim().min(5, { message: "Transaction number must be at least 5 characters" }).max(50),
});

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    passengerFirstName:"",
    passengerLastName: "",
    phoneNumber: "",
    transactionNumber: "",
  });

  const flight = location.state?.flight;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      toast.error("Please sign in to book a flight");
      navigate("/auth");
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  if (!flight) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 container mx-auto px-6 text-center">
          <h1 className="font-display text-2xl mb-4">No flight selected</h1>
          <Button onClick={() => navigate("/search")}>Go to Search</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    try {
      const validated = bookingSchema.parse(bookingData);
      setLoading(true);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          flight_origin: flight.origin,
          flight_destination: flight.destination,
          flight_date: flight.date,
          passenger_last_name: validated.passengerLastName,
          passenger_first_name: validated.passengerFirstName,
          phone_number: validated.phoneNumber,
          transaction_number: validated.transactionNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error submitting booking');
      } else {
        toast.success("Booking submitted successfully! Our agency will contact you soon.");
        navigate("/bookings");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Error submitting booking");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="font-display text-4xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-muted-foreground">Fill in your details to confirm your flight reservation</p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-1 animate-slide-up">
    {/* <FlightCard flight={flight} /> */}
  </div>

  <Card
    className="lg:col-span-2 border-2 shadow-large animate-slide-up"
    style={{ animationDelay: "0.1s" }}
  >
    <CardHeader>
      <CardTitle className="font-display text-2xl">Passenger Information</CardTitle>
      <CardDescription>Please provide accurate information for your booking</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="passengerFirstName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            First Name (as on passport)
          </Label>
          <Input
            id="passengerFirstName"
            placeholder="John"
            value={bookingData.passengerFirstName}
            onChange={(e) =>
              setBookingData({ ...bookingData, passengerFirstName: e.target.value })
            }
            required
          />
        </div>
         <div className="space-y-2">
          <Label htmlFor="passengerLastName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Last Name (as on passport)
          </Label>
          <Input
            id="passengerLastName"
            placeholder="Doe"
            value={bookingData.passengerLastName}
            onChange={(e) =>
              setBookingData({ ...bookingData, passengerLastName: e.target.value })
            }
            required
          />
        </div>


        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={bookingData.phoneNumber}
            onChange={(e) =>
              setBookingData({ ...bookingData, phoneNumber: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionNumber" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Transaction Number
          </Label>
          <Input
            id="transactionNumber"
            placeholder="TXN123456789"
            value={bookingData.transactionNumber}
            onChange={(e) =>
              setBookingData({
                ...bookingData,
                transactionNumber: e.target.value,
              })
            }
            required
          />
          <p className="text-sm text-muted-foreground">
            Reference number for payment made to local agency
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Important Information:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Ensure your passport is valid for at least 6 months</li>
            <li>Our agency will contact you within 24 hours</li>
            <li>Payment arrangements will be confirmed before booking</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>
      </form>
    </CardContent>
  </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
