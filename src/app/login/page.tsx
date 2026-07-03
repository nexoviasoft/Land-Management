"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/redux/api/authApiSlice";
import { useGetLoginSlidesQuery } from "@/redux/api/loginSlidesApiSlice";
import { setCredentials } from "@/redux/features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
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
} from "lucide-react";

const DEFAULT_SLIDES = [
  {
    title: "Secure Ledger Records",
    description: "Access, verify, and track authentic land deeds and ledger khatians with cryptographically secured records.",
    icon: "ShieldCheck",
    color: "from-brand-orange to-orange-650",
    badge: "Security Verified",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Smart Mutation (Namjari)",
    description: "Submit mutation applications online, track progress in real-time, and get automatic digital approvals.",
    icon: "Layers",
    color: "from-orange-600 to-amber-600",
    badge: "Digital Automation",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "GIS & Digital Mapping",
    description: "Interact with advanced georeferenced maps, check plots, zoning data, and land boundaries instantly.",
    icon: "Map",
    color: "from-brand-orange to-amber-750",
    badge: "GIS Integrated",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop"
  }
];

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  Layers,
  Map,
  Landmark,
  Sparkles,
};

const getIconComponent = (iconName: string) => {
  return ICON_MAP[iconName] || ShieldCheck;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { data: slidesResponse } = useGetLoginSlidesQuery();

  const apiSlides = slidesResponse?.data;
  const activeSlides = apiSlides && apiSlides.length > 0 ? apiSlides : DEFAULT_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const loadingToastId = toast.loading("Verifying credentials...");

    try {
      const response = await login({ email, password }).unwrap();

      const token = response?.data?.access_token || response?.access_token;
      const user = response?.data?.user || response?.user;
      const role = user?.role || "admin";

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("role", role);

      dispatch(
        setCredentials({
          user: user || { email },
          token: token,
          role: role,
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



  const currentSlideSafe = currentSlide % activeSlides.length;
  const activeSlide = activeSlides[currentSlideSafe] || activeSlides[0];
  const ActiveIcon = getIconComponent(activeSlide.icon);

  return (
    <div className="min-h-screen flex bg-white overflow-hidden font-sans">
      {/* LEFT PANEL: Image Slideshow */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-200">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideSafe}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 via-transparent to-amber-950/10" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="LandSync Logo"
            width={140}
            height={36}
            className="h-9 w-auto object-contain brightness-0 invert"
            priority
          />
        </div>

        {/* Feature Content */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideSafe}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeSlide.badge}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                  {activeSlide.title}
                </h2>
                <p className="text-slate-200 text-base leading-relaxed">
                  {activeSlide.description}
                </p>
              </div>

              <div className="p-5 bg-white/10 border border-white/15 backdrop-blur-xl rounded-2xl flex items-start gap-4 shadow-xl">
                <div className={`p-3 bg-gradient-to-br ${activeSlide.color} rounded-xl shrink-0 text-white shadow-md`}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-300">Live Status</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    Fully operational <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-2.5 mt-8">
            {activeSlides.map((_slide: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlideSafe === idx ? "w-8 bg-brand-orange" : "w-2 bg-white/30 hover:bg-white/50"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/15">
          <div>
            <p className="text-2xl font-bold text-white">99.8%</p>
            <p className="text-[11px] text-slate-300 font-medium">Uptime Guarantee</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">14.2K+</p>
            <p className="text-[11px] text-slate-300 font-medium">Processed Mutations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3.2M+</p>
            <p className="text-[11px] text-slate-300 font-medium">Registered Deeds</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-orange-100/30 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-amber-100/25 rounded-full blur-[90px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 relative z-10"
        >
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="inline-flex mb-4 justify-center items-center">
              <Image
                src="/logo2.png"
                alt="LandSync Logo"
                width={160}
                height={42}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-orange shrink-0" />
              <span>Sign In to <span className="text-brand-orange">Portal</span></span>
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 max-w-sm">
              Enter your credentials to access the LandSync dashboard.
            </p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm mb-5 flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-ping" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange focus:bg-white transition-all text-sm font-medium"
                  placeholder="admin@landsync.gov.bd"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>

                {/* Fixed Link */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset must be initiated by an administrator.");
                  }}
                  className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 bg-white text-brand-orange focus:ring-brand-orange/30 accent-brand-orange transition-colors cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-slate-600 cursor-pointer select-none">
                Remember my session on this device
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange-hover hover:to-amber-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange-hover/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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


        </motion.div>
      </div>
    </div>
  );
}