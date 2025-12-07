import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Home, Eye, EyeOff, HelpCircle } from "lucide-react";
import { z } from "zod";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signUpSchema.parse(signUpData);
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/search`,
          data: {
            full_name: validated.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created successfully! You can now search for flights.");
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
      
      {/* Empty Left Side - Reserved for further instructions */}
      <div className="hidden md:flex w-1/2 h-screen" style={{ backgroundColor: '#1a4d5e' }}>
        {/* Empty space for future content */}
      </div>

      {/* Sign Up Form Section - Right Half */}
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
          {/* Sign Up Card */}
          <Card className="bg-card/95 backdrop-blur-md border-2 border-border/50 shadow-large rounded-xl animate-slide-up hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">New Members</span>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Need help?
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    className="h-12 text-base transition-all duration-200 hover:border-primary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="h-12 text-base transition-all duration-200 hover:border-primary/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
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
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-white/95 text-base font-medium">
              Already have an account?{" "}
              <Link
                to="/auth"
                className="font-semibold underline hover:no-underline transition-all duration-200 hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

