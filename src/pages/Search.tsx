import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search as SearchIcon, Plane, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Flight } from "@/types/flight";
import { API_BASE_URL } from "@/lib/api";

const Search = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    // date: "",
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      toast.error("Please sign in to search for flights");
      navigate("/auth");
    }
  }, [navigate]);

 const handleFlightSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!searchData.origin || !searchData.destination /*|| !searchData.date*/) {
    toast.error("Please fill in origin, destination, and date");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/api/aviationstack/search-flights?dep_iata=${encodeURIComponent(
        searchData.origin
      )}&arr_iata=${encodeURIComponent(
        searchData.destination)}`
    );

    const data: Flight[] = await response.json();

    if (!response.ok) {
      throw new Error((data as any)?.error || "Failed to fetch flights");
    }

    setFlights(data);

    if (data.length === 0) {
      toast.error("No flights found");
    }
  } catch (error: any) {
    toast.error(error.message || "Unable to fetch flights");
  } finally {
    setLoading(false);
  }
};

  const handleBookFlight = (flight: Flight) => {
    navigate("/booking", { state: { flight } });
  
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <Card className="mb-12 border-2 shadow-large">
            <CardHeader>
              <CardTitle className="font-display text-3xl flex items-center gap-2">
                <SearchIcon className="w-8 h-8 text-primary" />
                Search Flights
              </CardTitle>
              <CardDescription>
                Find your perfect flight with PXL Travel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleFlightSearch}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    placeholder="New York (JFK)"
                    value={searchData.origin}
                    onChange={(e) =>
                      setSearchData({ ...searchData, origin: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="London (LHR)"
                    value={searchData.destination}
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        destination: e.target.value,
                      })
                    }
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={searchData.date}
                    onChange={(e) =>
                      setSearchData({ ...searchData, date: e.target.value })
                    }
                  />
                </div> */}

                <div className="flex items-end">
                  <Button type="submit" className="w-full" disabled={loading}>
                    <SearchIcon className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold mb-6">
              Available Flights
            </h2>

            {flights.map((flight, index) => (
              <Card
                key={flight.id}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-medium animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-hero-end rounded-lg flex items-center justify-center">
                          <Plane className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold">
                            {flight.airline}
                          </h3>
                          {/* <p className="text-sm text-muted-foreground">
                            {flight.date}
                          </p> */}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-semibold">{flight.origin}</p>
                          <p className="text-sm text-muted-foreground">
                            {flight.departureTime}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <p className="text-sm text-muted-foreground">
                              {flight.duration}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">To</p>
                          <p className="font-semibold">{flight.destination}</p>
                          <p className="text-sm text-muted-foreground">
                            {flight.arrivalTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 md:border-l md:pl-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        <span className="font-display text-3xl font-bold text-primary">
                          {flight.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleBookFlight(flight)}
                        className="w-full md:w-auto"
                      >
                        Book Flight
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;