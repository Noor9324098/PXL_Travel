import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Bus, Calendar, Clock, CreditCard, Loader2, Plane, Phone, Ticket, User } from "lucide-react";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";
import type { TravelOption } from "@/lib/travelOptions";

const bookingSchema = z.object({
  passengerFirstName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  passengerLastName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  phoneNumber: z.string().trim().min(10, { message: "Phone number must be at least 10 digits" }).max(20),
  transactionNumber: z.string().trim().min(5, { message: "Transaction number must be at least 5 characters" }).max(50),
});

type SelectedTrip = TravelOption & {
  airline?: string;
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    passengerFirstName: "",
    passengerLastName: "",
    phoneNumber: "",
    transactionNumber: "",
  });

  const selectedTrip: SelectedTrip | null = useMemo(() => {
    const rawSelection = location.state?.trip ?? location.state?.flight;

    if (!rawSelection) return null;

    return {
      kind: rawSelection.kind ?? "international-flight",
      title: rawSelection.title ?? rawSelection.airline ?? "Selected Trip",
      operator: rawSelection.operator ?? rawSelection.airline ?? "PXL Travel",
      origin: rawSelection.origin,
      destination: rawSelection.destination,
      date: rawSelection.date,
      departureTime: rawSelection.departureTime ?? "",
      arrivalTime: rawSelection.arrivalTime ?? "",
      duration: rawSelection.duration ?? "",
      price: rawSelection.price ?? "",
      seatsLeft: rawSelection.seatsLeft ?? "",
      description: rawSelection.description ?? "",
      airline: rawSelection.airline,
      id: rawSelection.id ?? "",
    };
  }, [location.state]);

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

  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 container mx-auto px-6 text-center">
          <h1 className="font-display text-2xl mb-4">No flight selected</h1>
          <Button
            onClick={() => navigate("/search")}
            className="bg-[#DB7B21] hover:bg-[#c96e1d] text-white border-0"
          >
            Go to Search
          </Button>
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
          flight_origin: selectedTrip.origin,
          flight_destination: selectedTrip.destination,
          flight_date: selectedTrip.date,
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
    <div className="min-h-screen" style={{ backgroundColor: "rgba(219, 123, 33, 0.1)" }}>
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <div className="w-12 h-12 mb-4 bg-[#DB7B21] rounded-lg flex items-center justify-center shadow-medium">
              {selectedTrip.kind === "bus" ? (
                <Bus className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Plane className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-4xl font-bold">Complete Your Booking</h1>
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Fill in your details to confirm your {selectedTrip.kind === "bus" ? "bus" : selectedTrip.kind === "local-flight" ? "local flight" : "flight"} reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-slide-up">
              <Card className="border-2 border-primary/20 shadow-medium">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Selected Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">Route</div>
                  <div className="font-semibold text-lg">
                    {selectedTrip.origin} → {selectedTrip.destination}
                  </div>
                  <div className="text-sm text-muted-foreground">Service</div>
                  <div className="font-medium">
                    {selectedTrip.operator || selectedTrip.airline || "PXL Travel"}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                  <div className="font-medium">{new Date(selectedTrip.date).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Schedule
                  </div>
                  <div className="font-medium">
                    {selectedTrip.departureTime && selectedTrip.arrivalTime
                      ? `${selectedTrip.departureTime} - ${selectedTrip.arrivalTime}`
                      : "Schedule available on request"}
                  </div>
                  <div className="text-sm text-muted-foreground">Estimated Price</div>
                  <div className="font-display text-2xl text-primary">{selectedTrip.price}</div>
                </CardContent>
              </Card>
            </div>

            <Card
              className="lg:col-span-2 border-2 border-primary/20 shadow-large animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="font-display text-2xl">Passenger Information</CardTitle>
                <CardDescription>
                  Please provide accurate information for your booking request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="passengerFirstName" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      First Name
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
                      <User className="w-4 h-4 text-primary" />
                      Last Name
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
                      <Phone className="w-4 h-4 text-primary" />
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
                      <CreditCard className="w-4 h-4 text-hero-end" />
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
                      Reference number for the payment or reservation transfer.
                    </p>
                  </div>

                  <div className="bg-accent/40 border border-primary/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium">Important Information:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Our team will review your request and confirm availability.</li>
                      <li>Keep your contact details reachable after submission.</li>
                      <li>Arrive early for your departure and keep your ticket details handy.</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#DB7B21] hover:bg-[#c96e1d] text-white border-0"
                    size="lg"
                    disabled={loading}
                  >
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
