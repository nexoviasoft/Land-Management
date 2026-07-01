"use client";

import { usePathname } from "next/navigation";
import { Bell, Shield, User, Wifi } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.includes("/admin");
  const isUser = pathname.includes("/user");

  const consoleLabel = isAdmin
    ? "ADMINISTRATOR"
    : isUser
      ? "CITIZEN PORTAL"
      : "LANDSYNC ROOT";

  const consoleCls = isAdmin
    ? "bg-teal-50 border-teal-200 text-teal-700"
    : isUser
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : "bg-slate-50 border-slate-200 text-slate-600";

  const ConsoleIcon = isAdmin ? Shield : isUser ? User : Wifi;

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-3 sticky top-0 z-20">
      {/* Left — system status */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium min-w-0">
        <span className="hidden sm:inline shrink-0">System Status:</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden xs:inline">Secure Connection</span>
          <span className="xs:hidden">Secure</span>
        </span>
      </div>

      {/* Right — role pill + notification bell */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active console badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase border px-2.5 py-1 rounded-lg ${consoleCls}`}
        >
          <ConsoleIcon size={11} />
          {consoleLabel}
        </span>

        {/* Mobile — icon-only badge */}
        <span
          className={`sm:hidden inline-flex items-center justify-center w-7 h-7 rounded-lg border ${consoleCls}`}
        >
          <ConsoleIcon size={13} />
        </span>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>
      </div>
    </header>
  );
}