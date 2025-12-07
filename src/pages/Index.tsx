import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #E97528 0%, rgba(233, 117, 40, 0.75) 25%, rgba(233, 117, 40, 0.4) 50%, rgba(233, 117, 40, 0.15) 75%, rgba(233, 117, 40, 0.08) 100%)",
      }}
    >
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CallToAction />
      <Footer />

      {/* Fixed Chat AI Assistant button */}
      <button
        type="button"
        aria-label="Chat with AI Assistant"
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ position: 'fixed' }}
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
};

export default Index;
