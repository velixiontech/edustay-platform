import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { toast } from "sonner";

import logo from "@/assets/logo.png";

import { supabase } from "@/integrations_supabase/client";

const Login = () => {
    const navigate = useNavigate();

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

        const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error("Incorrect email or password.");
    setLoading(false);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("Unable to load your account.");
    setLoading(false);
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  toast.success("Welcome back!");

  switch (profile?.role) {
    case "principal":
    case "admin":
      navigate("/admin");
      break;

    case "student":
      navigate("/student");
      break;

    case "owner":
      navigate("/owner");
      break;

    case "finance":
      navigate("/finance");
      break;

    case "maintenance":
      navigate("/maintenance-team");
      break;

    case "surety":
      navigate("/surety");
      break;

    default:
      toast.error("Your account has no assigned role.");
  }

  setLoading(false);
};
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FE0031]/10 via-[#6B0B81]/10 to-[#0226C7]/10 p-6">

      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0">
        <CardContent className="p-10">

          <div className="flex flex-col items-center mb-8">

            <img
              src={logo}
              alt="EduStay"
              className="w-20 h-20 mb-4"
            />

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FE0031] via-[#6B0B81] to-[#0226C7] bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="text-muted-foreground text-center mt-2">
              Sign in to your EduStay account.
            </p>

          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>

              <label className="text-sm font-medium">
                Email Address
              </label>

              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-2 h-14 rounded-2xl border border-gray-300 px-4 transition-all duration-300 focus:border-[#6B0B81] focus:ring-2 focus:ring-[#6B0B81]/30 focus:outline-none"
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Password
              </label>

              <div className="relative mt-2">

  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full h-14 rounded-2xl border border-gray-300 px-4 pr-12 transition-all duration-300 focus:border-[#6B0B81] focus:ring-2 focus:ring-[#6B0B81]/30 focus:outline-none"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6B0B81] transition-colors"
  >

    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}

    </button>

    </div>

            </div>

            <div className="flex justify-between text-sm">

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="#"
                className="text-[#6B0B81] hover:underline"
              >
                Forgot password?
              </a>

            </div>

            <Button
                type="submit"
                disabled={loading}
                className="
                    w-full
                    h-14
                    rounded-full
                    bg-gradient-to-r
                    from-[#FE0031]
                    via-[#6B0B81]
                    to-[#0226C7]
                    hover:scale-[1.02]
                    hover:shadow-xl
                    transition-all
                    duration-300
            "
            >           

            {loading ? (

            <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing In...
            </>

            ) : (

            "Sign In"

            )}

            </Button>

          </form>

          <div className="mt-8 text-center">

            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-[#6B0B81]"
            >
              ← Back to Home
            </Link>

          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default Login;