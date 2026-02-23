import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Bus, ArrowLeft, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { z } from "zod";

const urbanTransportSchema = z.object({
  route_name: z.string().min(1, "Route name is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  transport_type: z.string().min(1, "Transport type is required"),
  departure_time: z.string().min(1, "Departure time is required"),
  arrival_time: z.string().min(1, "Arrival time is required"),
  trip_date: z.string().min(1, "Trip date is required"),
  price: z.string().min(1, "Price is required"),
  duration: z.string().min(1, "Duration is required"),
  available_seats: z.string().min(1, "Available seats is required"),
});

const AddUrbanTransportation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    route_name: "",
    origin: "",
    destination: "",
    transport_type: "",
    departure_time: "",
    arrival_time: "",
    trip_date: "",
    price: "",
    duration: "",
    available_seats: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = urbanTransportSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase
        .from("urban_transportation")
        .insert([
          {
            route_name: validated.route_name,
            origin: validated.origin,
            destination: validated.destination,
            transport_type: validated.transport_type,
            departure_time: validated.departure_time,
            arrival_time: validated.arrival_time,
            trip_date: validated.trip_date,
            price: parseFloat(validated.price),
            duration: validated.duration,
            available_seats: parseInt(validated.available_seats),
            description: formData.description || null,
          },
        ]);

      if (error) {
        toast.error(error.message || "Failed to add urban transportation route");
      } else {
        toast.success("Urban transportation route added successfully!");
        setFormData({
          route_name: "",
          origin: "",
          destination: "",
          transport_type: "",
          departure_time: "",
          arrival_time: "",
          trip_date: "",
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
                  <Bus className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl font-bold">Add Urban Transportation</h1>
                  <p className="text-muted-foreground text-lg">
                    Create a new bus or urban transportation route
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border-2 shadow-large">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Route Details</CardTitle>
                <CardDescription>
                  Fill in all the required information to add a new transportation route
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Route Name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="route_name">Route Name *</Label>
                      <Input
                        id="route_name"
                        placeholder="e.g., Budapest to Vienna Express"
                        value={formData.route_name}
                        onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Transport Type */}
                    <div className="space-y-2">
                      <Label htmlFor="transport_type">Transport Type *</Label>
                      <Select
                        value={formData.transport_type}
                        onValueChange={(value) => setFormData({ ...formData, transport_type: value })}
                        required
                      >
                        <SelectTrigger id="transport_type">
                          <SelectValue placeholder="Select transport type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="train">Train</SelectItem>
                          <SelectItem value="metro">Metro</SelectItem>
                          <SelectItem value="tram">Tram</SelectItem>
                          <SelectItem value="shuttle">Shuttle</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Trip Date */}
                    <div className="space-y-2">
                      <Label htmlFor="trip_date">Trip Date *</Label>
                      <Input
                        id="trip_date"
                        type="date"
                        value={formData.trip_date}
                        onChange={(e) => setFormData({ ...formData, trip_date: e.target.value })}
                        required
                      />
                    </div>

                    {/* Origin */}
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin *</Label>
                      <Input
                        id="origin"
                        placeholder="e.g., Budapest Central Station"
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
                        placeholder="e.g., Vienna Central Station"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
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
                        placeholder="e.g., 2h 45m"
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
                        placeholder="e.g., 25.00"
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
                        placeholder="e.g., 30"
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
                      placeholder="Additional route information, stops, amenities..."
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
                          Adding Route...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Transportation Route
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

export default AddUrbanTransportation;

