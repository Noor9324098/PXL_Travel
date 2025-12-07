import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Globe, Users, Cpu } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "No Credit Card Hassle",
    description: "Perfect for users without international banking access. Submit booking requests and pay through local agencies.",
    color: "from-accent to-warm",
  },
  {
    icon: Cpu,
    title: "AI-Powered Intelligence",
    description: "Machine learning algorithms analyze your preferences to provide personalized flight recommendations that match your travel style.",
    color: "from-primary to-sky",
  },
  {
    icon: Users,
    title: "Local Agency Support",
    description: "Connect with trusted local travel agencies who understand your community and provide personalized service.",
    color: "from-hero-start to-hero-end",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access international flight options while maintaining the convenience and trust of local payment and support.",
    color: "from-sky to-primary",
  },
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Built for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Breaking down barriers to make flight booking accessible to all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="border-2 border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden animate-slide-up bg-card/80 backdrop-blur-sm hover:shadow-large"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
