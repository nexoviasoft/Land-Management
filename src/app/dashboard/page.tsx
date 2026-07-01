"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGetOverviewQuery } from "@/redux/api/overviewApiSlice";

export default function DashboardLandingPage() {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const { data: overviewRes, isLoading } = useGetOverviewQuery({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPartners = overviewRes?.data?.totalPartners ?? 0;
  const recentActivity = overviewRes?.data?.recentActivity ?? "No recent activity.";

  return (
    <div className="w-full space-y-8 py-8 px-4 max-w-7xl mx-auto relative">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Total Partner</h2>
          <p className="text-4xl font-bold text-emerald-600 mt-4">
            {isLoading ? "..." : totalPartners}
          </p>
        </div>

        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          <p className="text-slate-600 mt-4 text-sm leading-relaxed">
            {isLoading ? "Loading..." : recentActivity}
          </p>
        </div>

        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Time & Date</h2>
          <p className="text-slate-600 mt-4 font-medium">{currentDateTime || "Loading..."}</p>
        </div>
      </div>

      <div className="pt-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
        >
          Go Main Arman Agro
        </Link>
      </div>
    </div>
  );
}
