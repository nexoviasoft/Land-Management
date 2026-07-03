"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  CheckCircle2,
  Activity,
  ArrowRight,
  Plus,
  MapPin,
  Clock,
  ShieldCheck,
  Landmark,
} from "lucide-react";

export default function AdminOverviewPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      title: "Total Registered Users",
      value: "4 Active",
      change: "+25% from last week",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-brand-orange to-orange-500",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Land Records Ledger",
      value: "14 Deeds",
      change: "+3 new titles pending",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-500 to-amber-500",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Verified Land Deeds",
      value: "11 Certified",
      change: "85% verification rate",
      icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-600 to-brand-orange",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Active System Health",
      value: "100% Online",
      change: "All nodes fully secure",
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-amber-600 to-brand-orange",
      glow: "shadow-brand-orange/10",
    },
  ];

  const recentRequests = [
    {
      id: "REQ-0428",
      khatian: "Khatian #5821",
      mouza: "Gulshan",
      district: "Dhaka",
      status: "Approved",
      statusColor: "bg-orange-50 text-brand-orange border-orange-100",
      time: "2 hours ago",
    },
    {
      id: "REQ-0427",
      khatian: "Khatian #3942",
      mouza: "Banani",
      district: "Dhaka",
      status: "Pending",
      statusColor: "bg-amber-50 text-amber-700 border-amber-100",
      time: "5 hours ago",
    },
    {
      id: "REQ-0426",
      khatian: "Khatian #8812",
      mouza: "Mirpur",
      district: "Dhaka",
      status: "In Review",
      statusColor: "bg-blue-50 text-blue-700 border-blue-100",
      time: "1 day ago",
    },
  ];

  const quickLinks = [
    {
      href: "/dashboard/users",
      label: "Manage Platform Users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      href: "/dashboard/landdocuments",
      label: "View Land Ledgers",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/dashboard/profile",
      label: "Audit Profile Security",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full min-h-screen space-y-6 sm:space-y-8 lg:space-y-10 px-3 sm:px-6 lg:px-10 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-brand-orange/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[20%] left-[-10%] w-[380px] h-[380px] bg-amber-400/10 rounded-full blur-[110px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[420px] h-[420px] bg-brand-orange/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-orange-200/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Welcome Banner */}
      <div className="w-full bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.12)] relative overflow-hidden group hover:border-brand-orange/25 transition-all duration-500">
        {/* Decorative inner light shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="space-y-3.5 text-center md:text-left w-full md:w-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-brand-orange/10 to-orange-500/10 border border-brand-orange/15 text-brand-orange shadow-sm shadow-brand-orange/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
            </span>
            Superadmin Session Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide flex items-center justify-center md:justify-start gap-1.5">
            <Clock className="w-4 h-4 text-brand-orange" />
            {currentDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto relative z-10">
          <Link
            href="/dashboard/landdocuments/create"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-brand-orange to-orange-600 text-white hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-90" />
            Add Land Title
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(255,96,20,0.06)] hover:border-brand-orange/25 transition-all duration-500 hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-[13px] font-bold text-slate-500 tracking-wide uppercase">
                {stat.title}
              </span>
              <div
                className={`w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 ${stat.glow}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-6 space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 bg-clip-text text-transparent tracking-tight">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                <p className="text-[11px] sm:text-xs text-slate-500 font-semibold">
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Activities & Quick Links */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Ledger Requests */}
        <div className="lg:col-span-2 bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-brand-orange/20 transition-all duration-500">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent tracking-tight">
                Recent Ledger Requests
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Latest deed registration and verification requests
              </p>
            </div>
            <Link
              href="/dashboard/landdocuments"
              className="shrink-0 text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 group/link bg-orange-50 hover:bg-orange-100/70 border border-orange-100/50 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100/70">
            {recentRequests.map((req, idx) => (
              <div
                key={idx}
                className="py-4.5 first:pt-0 last:pb-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3.5 group/item transition-all duration-300"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-orange-50 border border-orange-100/60 flex items-center justify-center text-brand-orange shadow-sm group-hover/item:bg-gradient-to-br group-hover/item:from-brand-orange group-hover/item:to-orange-500 group-hover/item:text-white group-hover/item:scale-105 transition-all duration-500">
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-800 group-hover/item:text-orange-950 transition-colors">
                      {req.khatian}
                    </div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {req.mouza}, {req.district}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 sm:gap-4.5 ml-[58px] sm:ml-0">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border whitespace-nowrap shadow-sm ${req.statusColor}`}
                  >
                    {req.status}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {req.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-brand-orange/20 transition-all duration-500 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent tracking-tight">
                Quick Operations
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Shortcuts to main administrative modules
              </p>
            </div>
 
            <div className="space-y-3.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-orange/20 hover:bg-white/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-50 text-brand-orange border border-orange-100/50 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brand-orange group-hover:to-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      {link.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                      {link.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-orange transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100/60 flex items-center justify-center gap-2 text-center mt-6">
            <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold font-mono tracking-tight">
              LandSync Node Ledger ID: LS-DB-PX92-0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}