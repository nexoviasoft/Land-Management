"use client";

import { usePathname } from "next/navigation";

export default function TopNavbar() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.includes("/admin");
  const isUser = pathname.includes("/user");

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
        <span>System Status:</span>
        <span className="text-emerald-600 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse"></span>
          Secure Connection
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Displaying active role in top navbar */}
        <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase bg-slate-50 border border-slate-200 px-3 py-1 rounded text-slate-600">
          Active Console: {isAdmin ? "ADMINISTRATOR" : isUser ? "CITIZEN PORTAL" : "LANDSYNC ROOT"}
        </span>

        <button className="relative p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
      </div>
    </header>
  );
}
