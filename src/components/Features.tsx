import { Bot, Heart, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI Chat Assistant",
    description: "Get instant flight suggestions and booking help from our intelligent virtual assistant available 24/7.",
    colorClass: "bg-[#DB7B21]",
  },
  {
    icon: Heart,
    title: "Personalized Recommendations",
    description: "Our smart algorithm learns your preferences to suggest flights that match your travel style and budget.",
    colorClass: "bg-[#DB7B21]",
  },
  {
    icon: Sparkles,
    title: "No Credit Card Required",
    description: "Submit booking requests without online payments. Perfect for users without international banking access.",
    colorClass: "bg-[#DB7B21]",
  },
  {
    icon: TrendingUp,
    title: "Smart Prioritization",
    description: "Agency staff receive AI-assisted booking prioritization to handle your request efficiently.",
    colorClass: "bg-[#DB7B21]",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with industry-standard security. Minimal PII storage and encrypted communications.",
    colorClass: "bg-[#DB7B21]",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Get instant notifications via email, SMS, or WhatsApp about your booking status and confirmations.",
    colorClass: "bg-[#DB7B21]",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-[#DB7B21]/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose PXL Travel?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology meets personalized service for seamless flight booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-medium group animate-slide-up bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl ${feature.colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
