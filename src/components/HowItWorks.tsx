import { Search, FileText, CheckCircle2, Bell } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Search Flights",
    description: "Browse personalized flight options with AI-powered recommendations based on your preferences and history.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Submit Request",
    description: "Fill out a simple booking form without needing a credit card. Include your contact details and preferences.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Agency Review",
    description: "Our local travel agency receives your request with AI prioritization and processes it quickly.",
  },
  {
    icon: Bell,
    number: "04",
    title: "Get Updates",
    description: "Receive real-time status updates via email, SMS, or WhatsApp until your booking is confirmed.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How PXL Travel Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to book your perfect flight
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-4" />
                )}
                
                <div className="relative bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-medium group h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-hero-end rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-medium">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
