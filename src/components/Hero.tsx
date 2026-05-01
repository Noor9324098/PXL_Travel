import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-flight.jpg";
import { ArrowRight, Clock3, MapPinned, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: Clock3,
    title: "Easy planning",
    description: "Clear route ideas in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted support",
    description: "Local agency help when you need it.",
  },
  {
    icon: MapPinned,
    title: "Brighter escapes",
    description: "From city breaks to dream getaways.",
  },
];

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Airplane wing during sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,44,78,0.9),rgba(219,123,33,0.82))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl text-primary-foreground">
            <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in">
              Dream bigger. Fly smarter.
            </div>

            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl lg:text-7xl animate-fade-in">
              Discover brighter routes for your next great escape.
            </h1>

            <p
              className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/85 md:text-xl animate-fade-in"
              style={{ animationDelay: "0.08s" }}
            >
              PXL Travel brings international flights, local agency support, and simple
              planning tools together so every trip feels smooth, exciting, and easy to trust.
            </p>

            <div
              className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-in"
              style={{ animationDelay: "0.16s" }}
            >
              <Button
                asChild
                size="lg"
                className="border-0 bg-[#DB7B21] px-7 text-white shadow-lg hover:bg-[#c96e1d]"
              >
                <Link to="/search">
                  Explore Flights
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
              >
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            <div
              className="mt-10 grid gap-4 sm:grid-cols-3 animate-fade-in"
              style={{ animationDelay: "0.24s" }}
            >
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm shadow-soft"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <highlight.icon className="h-5 w-5 text-[#FFE3C2]" />
                  </div>
                  <p className="font-semibold">{highlight.title}</p>
                  <p className="mt-1 text-sm text-primary-foreground/75">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-large backdrop-blur-md">
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-card/90 shadow-soft">
                    <img
                      src="/images/beach-bag.png"
                      alt="Tropical beach with bag and snorkel"
                      className="h-36 w-full object-cover md:h-40"
                    />
                  </div>

                  <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-card/90 shadow-soft">
                    <img
                      src="/images/happy-travellers.png"
                      alt="Happy travellers holding tickets"
                      className="h-36 w-full object-cover md:h-40"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-card/95 shadow-large">
                    <img
                      src="/images/pool-morning.png"
                      alt="Resort pool in the morning"
                      className="h-80 w-full object-cover"
                    />
                  </div>

                  <div className="rounded-[1.75rem] border border-white/15 bg-[#0f2a45]/55 p-5 text-white shadow-soft">
                    <p className="text-sm uppercase tracking-[0.25em] text-[#FFE3C2]">
                      Travel Vibe
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold">
                      Smooth searches, sunny inspiration, zero guesswork.
                    </p>
                    <div className="mt-5 overflow-hidden rounded-2xl">
                      <img
                        src="/images/sunset-umbrellas.png"
                        alt="Sunset at the sea with umbrellas"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white shadow-soft backdrop-blur-md md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFE3C2]">Fast Track</p>
              <p className="mt-1 text-sm font-semibold">Routes ready in moments</p>
            </div>

            <div className="absolute -right-6 bottom-10 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white shadow-soft backdrop-blur-md md:block">
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFE3C2]">Travel Ready</p>
              <p className="mt-1 text-sm font-semibold">Friendly support from first click to booking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
};
