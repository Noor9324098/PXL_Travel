import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Globe, Users, Compass } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "No Credit Card Hassle",
    description: "Perfect for users without international banking access. Submit booking requests and pay through local agencies.",
    color: "bg-[#DB7B21]",
  },
  {
    icon: Compass,
    title: "Simple Trip Planning",
    description: "Plan your route with clear options that fit your schedule, style, and budget.",
    color: "bg-[#DB7B21]",
  },
  {
    icon: Users,
    title: "Local Agency Support",
    description: "Connect with trusted local travel agencies who understand your community and provide personalized service.",
    color: "bg-[#DB7B21]",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access international flight options while maintaining the convenience and trust of local payment and support.",
    color: "bg-[#DB7B21]",
  },
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Built for real-world travel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clear tools, flexible support, and thoughtful service for every kind of traveler
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
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
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
