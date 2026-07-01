"use client";

import Link from "next/link";
import { Shield, User, ArrowRight, BookOpen } from "lucide-react";

export default function DashboardLandingPage() {
  return (
    <div className="w-full space-y-12 py-6 relative">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Title / Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Gateway Console
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Select Portal Access
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Welcome to the LandSync management console. Choose your authorized access level below to view records, verify deeds, and manage property ledger transactions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* User Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-550 p-10 flex flex-col justify-between space-y-10">
          {/* Card Top Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-550" />
          
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 transition-transform duration-350">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Citizen Portal
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access your personal deeds, track submitted land mutation applications, pay local property taxes, and verify the certification status of your parcels.
              </p>
            </div>
          </div>
          
          <Link
            href="/dashboard/landdocuments"
            className="group/btn w-full bg-slate-900 text-white hover:bg-emerald-600 font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-350 shadow-md shadow-slate-950/10"
          >
            <span>Enter Citizen Console</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-350 group-hover/btn:translate-x-1" />
          </Link>
        </div>

        {/* Admin Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-550 p-10 flex flex-col justify-between space-y-10">
          {/* Card Top Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-550" />

          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 transform group-hover:scale-105 transition-transform duration-350">
              <Shield className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                Administrator Console
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Review and verify submitted property titles, resolve land registry conflicts, coordinate on-site verification inspect teams, and inspect system audit logs.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin"
            className="group/btn w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-350 shadow-md shadow-emerald-600/20"
          >
            <span>Enter Administrator Console</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-350 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
