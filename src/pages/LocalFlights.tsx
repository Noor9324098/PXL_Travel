import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Plane, ShieldCheck, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { localFlights, type TravelOption } from "@/lib/travelOptions";

const LocalFlights = () => {
	const navigate = useNavigate();

	const handleBook = (trip: TravelOption) => {
		navigate("/booking", { state: { trip } });
	};

	return (
		<div
			className="min-h-screen"
			style={{
				backgroundColor: "rgba(219, 123, 33, 0.1)",
			}}
		>
			<Header />

			<main className="pt-24 pb-12">
				<div className="container mx-auto px-6">
					<div className="mb-8 animate-fade-in">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center shadow-medium">
								<Plane className="w-6 h-6 text-primary-foreground" />
							</div>
							<Badge className="bg-primary/10 text-primary border-primary/20">Local Flights</Badge>
						</div>
						<h1 className="font-display text-4xl font-bold mb-2">Local Flights</h1>
						<p className="text-muted-foreground max-w-2xl">
							Short-haul flights for fast regional travel. Pick a route and book directly without a search step.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-5">
						{localFlights.map((trip, index) => (
							<Card
								key={trip.id}
								className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-medium animate-slide-up bg-card"
								style={{ animationDelay: `${index * 0.08}s` }}
							>
								<CardHeader className="pb-4">
									<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
										<div className="space-y-3">
											<div className="flex flex-wrap items-center gap-3">
												<Badge className="bg-[#DB7B21] text-white border-0">{trip.kind.replace("-", " ")}</Badge>
												<span className="text-sm text-muted-foreground flex items-center gap-2">
													<ShieldCheck className="w-4 h-4 text-primary" />
													{trip.seatsLeft}
												</span>
											</div>
											<CardTitle className="font-display text-2xl">{trip.title}</CardTitle>
											<CardDescription className="text-base">
												{trip.operator} · {trip.description}
											</CardDescription>
										</div>

										<div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
											<Ticket className="w-5 h-5 text-primary" />
											<span className="font-display text-2xl font-bold text-primary">{trip.price}</span>
										</div>
									</div>
								</CardHeader>

								<CardContent>
									<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.8fr] lg:items-center">
										<div className="space-y-1">
											<p className="text-sm text-muted-foreground">Route</p>
											<p className="font-semibold text-lg">{trip.origin} → {trip.destination}</p>
											<p className="text-sm text-muted-foreground">{trip.operator}</p>
										</div>

										<div className="flex items-start gap-3">
											<Calendar className="w-5 h-5 text-primary mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Date</p>
												<p className="font-semibold">{new Date(trip.date).toLocaleDateString()}</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<Clock className="w-5 h-5 text-primary mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Schedule</p>
												<p className="font-semibold">{trip.departureTime} - {trip.arrivalTime}</p>
												<p className="text-sm text-muted-foreground">Duration: {trip.duration}</p>
											</div>
										</div>

										<div className="flex items-center justify-start lg:justify-end">
											<Button
												onClick={() => handleBook(trip)}
												className="w-full lg:w-auto bg-[#DB7B21] hover:bg-[#c96e1d] text-white border-0"
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

export default LocalFlights;
