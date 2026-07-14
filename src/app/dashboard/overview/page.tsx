"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
import { useGetSuperAdminOverviewQuery, useGetUserOverviewQuery } from "@/redux/api/overviewApiSlice";

export default function OverviewPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const role = useSelector((state: RootState) => state.auth.role);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: superAdminData, isLoading: isLoadingAdmin } = useGetSuperAdminOverviewQuery({}, { skip: role !== "admin" });
  const { data: userData, isLoading: isLoadingUser } = useGetUserOverviewQuery(user?.id || "", { skip: role !== "partner" || !user?.id });

  const isLoading = role === "admin" ? isLoadingAdmin : isLoadingUser;
  const apiData = role === "admin" ? superAdminData?.data || {} : userData?.data || {};

  const stats = role === "admin" ? [
    {
      title: "Total Registered Users",
      value: apiData.totalPartners !== undefined ? `${apiData.totalPartners} Active` : (isLoading ? "Loading..." : "0 Active"),
      change: "Active partners in system",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-brand-orange to-orange-500",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Land Records Ledger",
      value: apiData.totalLandDocs !== undefined ? `${apiData.totalLandDocs} Deeds` : (isLoading ? "Loading..." : "0 Deeds"),
      change: "Total land registered",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-500 to-amber-500",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Pending Approvals",
      value: apiData.pendingApprovals !== undefined ? `${apiData.pendingApprovals} Pending` : (isLoading ? "Loading..." : "0 Pending"),
      change: "Land docs awaiting review",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-600 to-brand-orange",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Active System Health",
      value: "100% Online",
      change: apiData.recentActivity || "All nodes fully secure",
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-amber-600 to-brand-orange",
      glow: "shadow-brand-orange/10",
    },
  ] : [
    {
      title: "My Land Records",
      value: apiData.totalLandDocs !== undefined ? `${apiData.totalLandDocs} Deeds` : (isLoading ? "Loading..." : "0 Deeds"),
      change: "Total documents uploaded",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-brand-orange to-orange-500",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Pending Approvals",
      value: apiData.pendingApprovals !== undefined ? `${apiData.pendingApprovals} Pending` : (isLoading ? "Loading..." : "0 Pending"),
      change: "Docs awaiting review",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-orange-600 to-brand-orange",
      glow: "shadow-brand-orange/10",
    },
    {
      title: "Active System Health",
      value: "100% Online",
      change: apiData.recentActivity || "All nodes fully secure",
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-amber-600 to-amber-500",
      glow: "shadow-brand-orange/10",
    },
  ];

  const recentRequests = apiData.recentDocs?.length > 0
    ? apiData.recentDocs.map((doc: any) => ({
      id: `REQ-${doc.id || Math.floor(Math.random() * 1000)}`,
      khatian: `Khatian #${doc.landDetails?.khatianNo || 'N/A'}`,
      mouza: doc.location?.mouza || 'Unknown',
      district: doc.location?.district || 'Unknown',
      status: doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : "Unknown",
      statusColor: doc.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : (doc.status === "rejected" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-orange-50 text-brand-orange border-orange-100"),
      time: new Date(doc.uploadedAt).toLocaleDateString(),
    }))
    : [
      {
        id: "-",
        khatian: isLoading ? "Loading..." : "No recent activity",
        mouza: "-",
        district: "-",
        status: "N/A",
        statusColor: "bg-slate-50 text-slate-500 border-slate-100",
        time: "-",
      }
    ];

  const quickLinks = role === "admin" ? [
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
  ] : [
    {
      href: "/dashboard/landdocuments",
      label: "View My Land Ledgers",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/dashboard/profile",
      label: "My Profile",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full min-h-screen space-y-6 sm:space-y-8 lg:space-y-10 px-3 sm:px-6 lg:px-10 py-4 sm:py-6 relative overflow-x-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-brand-orange/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[20%] left-[-10%] w-[380px] h-[380px] bg-amber-400/10 rounded-full blur-[110px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[420px] h-[420px] bg-brand-orange/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-orange-200/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.12)] relative overflow-hidden group hover:border-brand-orange/25 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="space-y-3.5 text-center md:text-left w-full md:w-auto relative z-10">
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
            Add Land
          </Link>
        </div>
      </div>

      <div className={`w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-${role === 'admin' ? '4' : '3'} gap-5 sm:gap-6`}>
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

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
            {recentRequests.map((req: any, idx: number) => (
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

        <div className="bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-brand-orange/20 transition-all duration-500 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent tracking-tight">
                Quick Operations
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Shortcuts to main modules
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
