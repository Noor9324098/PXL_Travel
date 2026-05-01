import { Bell, CheckCircle2, FileText, Search } from "lucide-react";

type JourneyStep = {
  icon: typeof Search;
  number: string;
  stamp: string;
  title: string;
  description: string;
  offsetClass: string;
  tiltClass: string;
};

const journeySteps: JourneyStep[] = [
  {
    icon: Search,
    number: "01",
    stamp: "IDEA STAMP",
    title: "Pick Your Direction",
    description: "Start with where you want to go, when you want to move, and what pace feels right.",
    offsetClass: "lg:mt-0",
    tiltClass: "lg:-rotate-2",
  },
  {
    icon: FileText,
    number: "02",
    stamp: "BOARDING NOTE",
    title: "Shape The Request",
    description: "Drop your details once, add preferences, and turn your plan into a clear booking request.",
    offsetClass: "lg:mt-14",
    tiltClass: "lg:rotate-1",
  },
  {
    icon: CheckCircle2,
    number: "03",
    stamp: "AGENCY CHECK",
    title: "Local Team Handles It",
    description: "A travel agent reviews your request and confirms the best fit with practical support.",
    offsetClass: "lg:mt-4",
    tiltClass: "lg:-rotate-1",
  },
  {
    icon: Bell,
    number: "04",
    stamp: "TAKEOFF ALERT",
    title: "Follow The Countdown",
    description: "Receive updates as your booking progresses until your trip is fully locked in.",
    offsetClass: "lg:mt-16",
    tiltClass: "lg:rotate-2",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,123,33,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(12,39,68,0.12),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,42,69,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,42,69,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center animate-fade-in">
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            How It Works: Passport Stamp Route
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Think of booking as a travel storyboard, not a plain checklist.
          </p>
        </div>

        <div className="mx-auto hidden max-w-6xl lg:block">
          <div className="relative rounded-[2.25rem] border-2 border-border/80 bg-card/80 p-10 shadow-large backdrop-blur-sm">
            <div className="pointer-events-none absolute left-16 right-16 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#DB7B21]/45" />

            <div className="grid grid-cols-4 gap-6">
              {journeySteps.map((step, index) => (
                <article
                  key={step.number}
                  className={`group relative rounded-[1.75rem] border-2 border-border/85 bg-background/95 p-6 shadow-medium transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-large ${step.offsetClass} ${step.tiltClass}`}
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-border/80 bg-background" />
                  <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-border/80 bg-background" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DB7B21]/15 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-[#DB7B21]/40 bg-[#DB7B21]/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-primary">
                      {step.stamp}
                    </span>
                  </div>

                  <p className="mt-5 font-mono text-xs font-bold tracking-[0.2em] text-primary/80">
                    STOP {step.number}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-xl space-y-5 lg:hidden">
          {journeySteps.map((step, index) => (
            <article
              key={step.number}
              className="relative overflow-hidden rounded-3xl border-2 border-border/80 bg-card/90 p-6 shadow-medium"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#DB7B21]" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DB7B21]/15 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-bold tracking-[0.18em] text-primary/80">
                  STOP {step.number}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-border/80 bg-card/75 p-6 text-center shadow-soft backdrop-blur-sm">
          <p className="font-display text-2xl font-semibold text-foreground">
            Four stops, one clear route, and your trip starts feeling real.
          </p>
        </div>
      </div>
    </section>
  );
};
