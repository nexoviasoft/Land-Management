"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Activity, 
  ArrowRight, 
  Plus, 
  MapPin, 
  Clock,
  ShieldCheck
} from "lucide-react";

export default function AdminOverviewPage() {
  // Current date formatting
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
      icon: <Users className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/10",
    },
    {
      title: "Land Records Ledger",
      value: "14 Deeds",
      change: "+3 new titles pending",
      icon: <FileText className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      glow: "shadow-teal-500/10",
    },
    {
      title: "Verified Land Deeds",
      value: "11 Certified",
      change: "85% verification rate",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-emerald-600 to-emerald-500",
      glow: "shadow-emerald-500/10",
    },
    {
      title: "Active System Health",
      value: "100% Online",
      change: "All nodes fully secure",
      icon: <Activity className="w-6 h-6" />,
      color: "from-teal-600 to-emerald-600",
      glow: "shadow-teal-500/10",
    },
  ];

  const recentRequests = [
    {
      id: "REQ-0428",
      khatian: "Khatian #5821",
      mouza: "Gulshan",
      district: "Dhaka",
      status: "Approved",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
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

  return (
    <div className="space-y-10 py-4 w-full relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Welcome Banner */}
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-55 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Superadmin Session Active
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {currentDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/landdocuments/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-650 text-white hover:from-emerald-700 hover:to-teal-750 transition-all duration-350 shadow-md shadow-emerald-650/15 group"
          >
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            Add Land Title
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{stat.title}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md ${stat.glow}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-xs text-slate-450 font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Activities & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Ledger Requests */}
        <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">Recent Ledger Requests</h2>
              <p className="text-xs text-slate-450">Latest deed registration and verification requests</p>
            </div>
            <Link 
              href="/dashboard/landdocuments" 
              className="text-xs font-semibold text-emerald-650 hover:text-emerald-700 flex items-center gap-1 group/link"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRequests.map((req, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{req.khatian}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.mouza}, {req.district}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${req.statusColor}`}>
                    {req.status}
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {req.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">Quick Operations</h2>
              <p className="text-xs text-slate-450">Shortcuts to main administrative modules</p>
            </div>

            <div className="space-y-3">
              <Link 
                href="/dashboard/users" 
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-500/20 hover:bg-slate-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Manage Platform Users</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                href="/dashboard/landdocuments" 
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-500/20 hover:bg-slate-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">View Land Ledgers</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                href="/dashboard/profile" 
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-500/20 hover:bg-slate-50/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Audit Profile Security</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">LandSync Node Ledger ID: LS-DB-PX92-0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
