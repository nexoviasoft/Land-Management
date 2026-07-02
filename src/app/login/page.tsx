"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/redux/api/authApiSlice";
import { setCredentials } from "@/redux/features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Landmark, 
  ShieldCheck, 
  Map, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Database,
  Layers,
  ChevronRight,
  TrendingUp
} from "lucide-react";

const SLIDES = [
  {
    title: "Secure Ledger Records",
    description: "Access, verify, and track authentic land deeds and ledger khatians with cryptographically secured records.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    badge: "Security Verified"
  },
  {
    title: "Smart Mutation (Namjari)",
    description: "Submit mutation applications online, track progress in real-time, and get automatic digital approvals.",
    icon: Layers,
    color: "from-teal-500 to-cyan-600",
    badge: "Digital Automation"
  },
  {
    title: "GIS & Digital Mapping",
    description: "Interact with advanced georeferenced maps, check plots, zoning data, and land boundaries instantly.",
    icon: Map,
    color: "from-emerald-600 to-emerald-800",
    badge: "GIS Integrated"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const loadingToastId = toast.loading("Verifying credentials...");

    try {
      const response = await login({ email, password }).unwrap();
      
      const token = response?.data?.access_token || response?.access_token;
      const user = response?.data?.user || response?.user;
      
      if (token) {
        localStorage.setItem("token", token);
      }

      dispatch(
        setCredentials({
          user: user || { email },
          token: token,
          role: user?.role || "admin",
        })
      );

      toast.success("Welcome back! Redirecting...", { id: loadingToastId });
      router.push("/dashboard");
    } catch (err: any) {
      const errMsg = err?.data?.message || "Failed to login. Please check your credentials.";
      setErrorMsg(errMsg);
      toast.error(errMsg, { id: loadingToastId });
      console.error(err);
    }
  };

  const handleQuickFill = (role: "admin" | "partner") => {
    if (role === "admin") {
      setEmail("admin@landsync.gov.bd");
      setPassword("123456"); // Try typical NestJS/local development password
      toast.success("Filled Admin testing credentials");
    } else {
      setEmail("partner@landsync.gov.bd");
      setPassword("123456");
      toast.success("Filled Partner testing credentials");
    }
  };

  const ActiveIcon = SLIDES[currentSlide].icon;

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden font-sans">
      {/* LEFT PANEL: Interactive Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Branding Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
              LandSync
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Ministry of Land Services
            </p>
          </div>
        </div>

        {/* Middle Feature Slider (AnimatePresence) */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{SLIDES[currentSlide].badge}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {SLIDES[currentSlide].title}
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  {SLIDES[currentSlide].description}
                </p>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl flex items-start gap-4 shadow-xl">
                <div className={`p-3 bg-gradient-to-br ${SLIDES[currentSlide].color} rounded-xl shrink-0 text-white shadow-md`}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400">Live Status</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    Fully operational <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex gap-2.5 mt-8">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-emerald-500" : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/40">
          <div>
            <p className="text-2xl font-bold text-white">99.8%</p>
            <p className="text-[11px] text-slate-400 font-medium">Uptime Guarantee</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">14.2K+</p>
            <p className="text-[11px] text-slate-400 font-medium">Processed Mutations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3.2M+</p>
            <p className="text-[11px] text-slate-400 font-medium">Registered Deeds</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form & Glass Card (All screens) */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-950">
        {/* Animated Background Mesh */}
        <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-teal-500/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 z-10 flex lg:hidden items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-lg shadow-md flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">LandSync</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10"
        >
          {/* Form Header */}
          <div className="text-center md:text-left mb-8">
            <div className="inline-flex lg:hidden mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl justify-center items-center">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Sign In to Portal
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">
              Enter your credentials to access the LandSync dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm mb-5 flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-ping" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/80 transition-all text-sm font-medium"
                  placeholder="admin@landsync.gov.bd"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset must be initiated by an administrator.");
                  }}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/80 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600 transition-colors cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-slate-300 cursor-pointer select-none">
                Remember my session on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Developer Helper (Accordion / Hidden Panel) */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <span>Quick Test Logins</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Click a role below to auto-fill mock credentials for fast developer testing.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin")}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-bold py-2 px-3 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("partner")}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-bold py-2 px-3 rounded-lg text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Test Partner
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
