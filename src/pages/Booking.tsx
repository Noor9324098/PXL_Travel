import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, Plane, User, Phone, CreditCard, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const bookingSchema = z.object({
  passengerName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  phoneNumber: z.string().trim().min(10, { message: "Phone number must be at least 10 digits" }).max(20),
  transactionNumber: z.string().trim().min(5, { message: "Transaction number must be at least 5 characters" }).max(50),
});

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    passengerName: "",
    phoneNumber: "",
    transactionNumber: "",
  });

  const flight = location.state?.flight;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to book a flight");
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setPassportFile(file);
      setPassportPreview(URL.createObjectURL(file));
    }
  };

  const uploadPassport = async (userId: string): Promise<string | null> => {
    if (!passportFile) return null;

    setUploading(true);
    try {
      const fileExt = passportFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('passports')
        .upload(fileName, passportFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('passports')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      toast.error("Error uploading passport image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (!passportFile) {
      toast.error("Please upload your passport image");
      return;
    }

    try {
      const validated = bookingSchema.parse(bookingData);
      setLoading(true);

      const passportUrl = await uploadPassport(user.id);
      if (!passportUrl) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          flight_origin: flight.origin,
          flight_destination: flight.destination,
          flight_date: flight.date,
          passenger_name: validated.passengerName,
          phone_number: validated.phoneNumber,
          passport_image_url: passportUrl,
          transaction_number: validated.transactionNumber,
          status: 'pending',
        });

      if (error) throw error;

      toast.success("Booking submitted successfully! Our agency will contact you soon.");
      navigate("/bookings");
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
            {/* Flight Details */}
            <Card className="lg:col-span-1 border-2 h-fit animate-slide-up">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Airline</p>
                  <p className="font-semibold">{flight.airline}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-semibold">{flight.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-semibold">{flight.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{flight.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{flight.duration}</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-display text-2xl font-bold text-primary">{flight.price}</p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="lg:col-span-2 border-2 shadow-large animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Passenger Information</CardTitle>
                <CardDescription>Please provide accurate information for your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="passengerName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name (as on passport)
                    </Label>
                    <Input
                      id="passengerName"
                      placeholder="John Doe"
                      value={bookingData.passengerName}
                      onChange={(e) => setBookingData({ ...bookingData, passengerName: e.target.value })}
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
                      onChange={(e) => setBookingData({ ...bookingData, phoneNumber: e.target.value })}
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
                      onChange={(e) => setBookingData({ ...bookingData, transactionNumber: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Reference number for payment made to local agency
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Passport Photo/ID
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <input
                        id="passport"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="passport"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        {passportPreview ? (
                          <div className="relative">
                            <img
                              src={passportPreview}
                              alt="Passport preview"
                              className="max-h-48 rounded-lg"
                            />
                            <p className="text-sm text-muted-foreground mt-2">Click to change</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="font-medium">Click to upload passport image</p>
                              <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium">Important Information:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Ensure your passport is valid for at least 6 months</li>
                      <li>Provide a clear, readable photo of your passport</li>
                      <li>Our agency will contact you within 24 hours</li>
                      <li>Payment arrangements will be confirmed before booking</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading || uploading}>
                    {loading || uploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {uploading ? "Uploading..." : "Submitting..."}
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
