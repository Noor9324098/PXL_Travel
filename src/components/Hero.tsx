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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-hero-end/75" />
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
          
          <p className="text-xl md:text-2xl mb-16 text-primary-foreground/90 animate-slide-up max-w-3xl mx-auto" style={{ animationDelay: "0.1s" }}>
            PXL Travel connects you with local travel agencies. Get AI-powered personalized recommendations, submit booking requests, and travel with confidence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div>
              <div className="text-4xl font-bold font-display mb-2">100%</div>
              <div className="text-sm text-primary-foreground/80">No Credit Card Needed</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-display mb-2">AI</div>
              <div className="text-sm text-primary-foreground/80">Personalized Recommendations</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-display mb-2">24/7</div>
              <div className="text-sm text-primary-foreground/80">Agency Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
