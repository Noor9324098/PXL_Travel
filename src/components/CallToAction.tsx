import { Button } from "@/components/ui/button";
import { ArrowRight, Plane } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-[#DB7B21] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[#DB7B21]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready for a smoother, brighter trip?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
              Start with smart search tools, lean on local expertise, and turn travel plans into real bookings with less friction.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Link to="/search">
              <Button
                size="lg"
                className="border-0 bg-white px-8 text-[#DB7B21] shadow-lg hover:bg-white/90"
              >
                <Plane className="w-4 h-4" />
                Search Flights
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent px-8 text-white hover:bg-white/15 hover:text-white"
              >
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-primary-foreground/80 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>AI-powered recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
