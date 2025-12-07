import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Home, Eye, EyeOff, HelpCircle } from "lucide-react";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/search");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        navigate("/search");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (lottieRef.current) {
      const lottieElement = document.createElement('dotlottie-wc');
      lottieElement.setAttribute('src', 'https://lottie.host/daff50aa-bb55-45ce-a0c2-74a80f4d90cb/5plNLgMsRS.lottie');
      lottieElement.setAttribute('autoplay', '');
      lottieElement.setAttribute('loop', '');
      lottieElement.setAttribute('mode', 'normal');
      lottieElement.style.width = '100%';
      lottieElement.style.height = '100%';
      lottieElement.style.objectFit = 'cover';
      
      // Wait for the element to be fully loaded and then ensure seamless looping
      const ensureSeamlessLoop = () => {
        // Access the internal player if available
        if (lottieElement.shadowRoot) {
          const player = lottieElement.shadowRoot.querySelector('dotlottie-player') as any;
          if (player) {
            // Ensure loop is enabled and mode is set for seamless playback
            player.setAttribute('loop', 'true');
            player.setAttribute('autoplay', 'true');
            player.setAttribute('mode', 'normal');
            
            // Listen for animation complete and immediately restart
            player.addEventListener('complete', () => {
              // Immediately seek to start and play for seamless loop
              if (typeof player.seek === 'function') {
                player.seek(0);
              }
              if (typeof player.play === 'function') {
                player.play();
              }
            });
          }
        }
      };

      // Try to configure when element is ready
      lottieElement.addEventListener('ready', ensureSeamlessLoop);
      
      // Also try after a short delay to ensure element is fully initialized
      setTimeout(ensureSeamlessLoop, 100);
      
      lottieRef.current.appendChild(lottieElement);

      return () => {
        if (lottieRef.current && lottieElement.parentNode) {
          lottieElement.parentNode.removeChild(lottieElement);
        }
      };
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signInSchema.parse(signInData);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Signed in successfully!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex relative">
      <Link to="/" className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          className="gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Button>
      </Link>
      
      {/* Lottie Animation Section - Left Half (Dark Teal-Blue) */}
      <div className="hidden md:flex w-1/2 h-screen" style={{ backgroundColor: '#1a4d5e' }}>
        <div className="w-full h-full" ref={lottieRef}></div>
      </div>

      {/* Auth Form Section - Right Half */}
      <div 
        className="w-full md:w-1/2 flex items-center justify-center h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #E97528 0%, rgba(233, 117, 40, 0.85) 25%, rgba(233, 117, 40, 0.7) 50%, rgba(233, 117, 40, 0.6) 75%, rgba(233, 117, 40, 0.5) 100%)"
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md px-6 md:px-8 relative z-10">
          {/* Sign In Card */}
          <Card className="bg-card/95 backdrop-blur-md border-2 border-border/50 shadow-large rounded-xl animate-slide-up hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Already Members</span>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Need help?
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="h-12 text-base transition-all duration-200 hover:border-primary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="h-12 text-base transition-all duration-200 hover:border-primary/50 pr-14"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 flex items-center justify-center pointer-events-auto cursor-pointer bg-transparent"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-white/95 text-base font-medium">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold underline hover:no-underline transition-all duration-200 hover:text-white"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
