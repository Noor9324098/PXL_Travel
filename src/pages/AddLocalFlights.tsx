import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Plane, ArrowLeft, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { z } from "zod";

const localFlightSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  airline: z.string().min(1, "Airline is required"),
  departure_time: z.string().min(1, "Departure time is required"),
  arrival_time: z.string().min(1, "Arrival time is required"),
  flight_date: z.string().min(1, "Flight date is required"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
  available_seats: z.string().min(1, "Available seats is required"),
});

const AddLocalFlights = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    airline: "",
    departure_time: "",
    arrival_time: "",
    flight_date: "",
    price: "",
    duration: "",
    available_seats: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = localFlightSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase
        .from("local_flights")
        .insert([
          {
            origin: validated.origin,
            destination: validated.destination,
            airline: validated.airline,
            departure_time: validated.departure_time,
            arrival_time: validated.arrival_time,
            flight_date: validated.flight_date,
            price: parseFloat(validated.price),
            duration: validated.duration,
            available_seats: parseInt(validated.available_seats),
            description: formData.description || null,
          },
        ]);

      if (error) {
        toast.error(error.message || "Failed to add local flight");
      } else {
        toast.success("Local flight added successfully!");
        setFormData({
          origin: "",
          destination: "",
          airline: "",
          departure_time: "",
          arrival_time: "",
          flight_date: "",
          price: "",
          duration: "",
          available_seats: "",
          description: "",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-hero-end rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl font-bold">Add Local Flight</h1>
                  <p className="text-muted-foreground text-lg">
                    Create a new local flight route
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border-2 shadow-large">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Flight Details</CardTitle>
                <CardDescription>
                  Fill in all the required information to add a new local flight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Origin */}
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin *</Label>
                      <Input
                        id="origin"
                        placeholder="e.g., Budapest (BUD)"
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        required
                      />
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination *</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Vienna (VIE)"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        required
                      />
                    </div>

                    {/* Airline */}
                    <div className="space-y-2">
                      <Label htmlFor="airline">Airline *</Label>
                      <Input
                        id="airline"
                        placeholder="e.g., Wizz Air"
                        value={formData.airline}
                        onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                        required
                      />
                    </div>

                    {/* Flight Date */}
                    <div className="space-y-2">
                      <Label htmlFor="flight_date">Flight Date *</Label>
                      <Input
                        id="flight_date"
                        type="date"
                        value={formData.flight_date}
                        onChange={(e) => setFormData({ ...formData, flight_date: e.target.value })}
                        required
                      />
                    </div>

                    {/* Departure Time */}
                    <div className="space-y-2">
                      <Label htmlFor="departure_time">Departure Time *</Label>
                      <Input
                        id="departure_time"
                        type="time"
                        value={formData.departure_time}
                        onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                        required
                      />
                    </div>

                    {/* Arrival Time */}
                    <div className="space-y-2">
                      <Label htmlFor="arrival_time">Arrival Time *</Label>
                      <Input
                        id="arrival_time"
                        type="time"
                        value={formData.arrival_time}
                        onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 1h 30m"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 150.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    {/* Available Seats */}
                    <div className="space-y-2">
                      <Label htmlFor="available_seats">Available Seats *</Label>
                      <Input
                        id="available_seats"
                        type="number"
                        min="1"
                        placeholder="e.g., 50"
                        value={formData.available_seats}
                        onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional flight information..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding Flight...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Local Flight
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AddLocalFlights;

