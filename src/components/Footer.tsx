import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-foreground/10 bg-primary py-12 text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">PXL Travel</h3>
                <p className="text-sm text-primary-foreground/70">
                  Smart routes. Local support. Smoother booking.
                </p>
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-primary-foreground/80 md:mx-0">
              Discover flights with confidence and book with support that feels personal from
              the first search to final confirmation.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-display mb-4 text-lg font-semibold">Explore</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link to="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="transition-colors hover:text-accent">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link to="/auth" className="transition-colors hover:text-accent">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="transition-colors hover:text-accent">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-display mb-4 text-lg font-semibold">Why Travelers Stay</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Quick, clear flight planning that saves time</li>
              <li>Helpful local agency follow-up when it matters</li>
              <li>Clear booking steps with less friction</li>
              <li>One place for search, support, and updates</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/65 md:flex-row">
          <p>(c) {currentYear} PXL Travel. Crafted for confident, connected journeys.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span>Easy flight search</span>
            <span>Local support</span>
            <span>Travel made easier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
