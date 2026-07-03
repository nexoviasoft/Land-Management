"use client";

import { usePathname } from "next/navigation";
import { Bell, Shield, User, Wifi, Sparkles } from "lucide-react";

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
    ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/70 text-brand-orange shadow-orange-500/10"
    : isUser
      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/70 text-brand-orange shadow-orange-500/10"
      : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/70 text-slate-600 shadow-slate-500/10";

  const iconWrapCls = isAdmin
    ? "bg-gradient-to-br from-brand-orange to-orange-600"
    : isUser
      ? "bg-gradient-to-br from-brand-orange to-orange-600"
      : "bg-gradient-to-br from-slate-500 to-slate-600";

  const ConsoleIcon = isAdmin ? Shield : isUser ? User : Wifi;

  return (
    <header className="hidden md:flex h-16 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl px-6 items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.06)]">
      {/* Left — system status */}
      <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium min-w-0">
        <span className="hidden sm:inline shrink-0 text-slate-400">System Status:</span>
        <span className="text-brand-orange font-semibold flex items-center gap-2 shrink-0 bg-orange-50/70 border border-orange-200/60 px-2.5 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
          </span>
          <span className="hidden xs:inline">Secure Connection</span>
          <span className="xs:hidden">Secure</span>
        </span>
      </div>

      {/* Right — role pill + notification bell */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active console badge (desktop) */}
        <span
          className={`hidden sm:inline-flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase border pl-1.5 pr-3 py-1 rounded-full shadow-sm ${consoleCls}`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm ${iconWrapCls}`}>
            <ConsoleIcon size={11} />
          </span>
          {consoleLabel}
        </span>

        {/* Mobile — icon-only badge */}
        <span
          className={`sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm ${iconWrapCls}`}
        >
          <ConsoleIcon size={14} className="text-white" />
        </span>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full bg-slate-50 border border-slate-200/70 text-slate-500 hover:text-brand-orange hover:bg-orange-50 hover:border-orange-200 active:scale-90 transition-all duration-200 shadow-sm"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange ring-2 ring-white" />
          </span>
        </button>
      </div>
    </header>
  );
}