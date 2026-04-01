import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-flight.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Airplane wing during sunset" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#DB7B21]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Flight Booking</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up leading-tight">
            Book Flights Without Credit Cards
          </h1>

          {/* Collage of travel moments (replaces stats text) */}
          <div
            className="mt-10 md:mt-14 grid gap-4 md:gap-6 md:grid-cols-3 max-w-5xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="space-y-4 md:space-y-6">
              <div className="overflow-hidden rounded-2xl bg-card/90 shadow-soft">
                <img
                  src="/images/beach-bag.png"
                  alt="Tropical beach with bag and snorkel"
                  className="h-32 w-full object-cover md:h-40"
                />
              </div>
              <div className="overflow-hidden rounded-2xl bg-card/90 shadow-soft">
                <img
                  src="/images/happy-travellers.png"
                  alt="Happy travellers holding tickets"
                  className="h-32 w-full object-cover md:h-40"
                />
              </div>
            </div>

            <div className="hidden md:block">
              <div className="overflow-hidden rounded-3xl bg-card/95 shadow-large h-full flex items-center">
                <img
                  src="/images/pool-morning.png"
                  alt="Resort pool in the morning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex md:block">
              <div className="overflow-hidden rounded-3xl bg-card/95 shadow-large w-full">
                <img
                  src="/images/sunset-umbrellas.png"
                  alt="Sunset at the sea with umbrellas"
                  className="h-40 w-full object-cover md:h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#DB7B21]/25 z-10" />
    </section>
  );
};
