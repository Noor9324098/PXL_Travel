import { Button } from "@/components/ui/button";
import { Plane, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-hero-start to-hero-end relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Book Your Next Flight?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of travelers who book flights without credit cards through PXL Travel
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Link to="/search">
            </Link>
            <Link to="/auth">
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
