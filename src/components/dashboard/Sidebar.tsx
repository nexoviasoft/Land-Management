"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  AlertTriangle,
  FileText,
  MapPin,
  Home,
  FileBadge,
  PenLine,
  Banknote,
  MessageSquare,
  ArrowLeftRight,
  Shield,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

type NavLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
};

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = pathname.includes("/admin");
  const isUser = pathname.includes("/user");

  const getNavLinks = (): NavLink[] => {
    if (isAdmin) {
      return [
        { name: "Admin Overview", href: "/dashboard/admin", icon: <LayoutGrid size={18} /> },
        { name: "Mutation Requests Queue", href: "/dashboard/admin", badge: "42", icon: <ClipboardList size={18} /> },
        { name: "Disputed Land Claims", href: "/dashboard/admin", badge: "3", icon: <AlertTriangle size={18} /> },
        { name: "Registry Audit Logs", href: "/dashboard/admin", icon: <FileText size={18} /> },
        { name: "Land Survey Dispatch", href: "/dashboard/admin", icon: <MapPin size={18} /> },
      ];
    } else if (isUser) {
      return [
        { name: "Citizen Overview", href: "/dashboard/user", icon: <Home size={18} /> },
        { name: "My Registered Deeds", href: "/dashboard/user", badge: "3", icon: <FileBadge size={18} /> },
        { name: "Mutation Petitions", href: "/dashboard/user", badge: "1", icon: <PenLine size={18} /> },
        { name: "Online LD Tax (Khazana)", href: "/dashboard/user", icon: <Banknote size={18} /> },
        { name: "Support Desk Tickets", href: "/dashboard/user", icon: <MessageSquare size={18} /> },
      ];
    } else {
      return [
        { name: "Portal Selection", href: "/dashboard", icon: <LayoutGrid size={18} /> },
        { name: "User Console", href: "/dashboard/user", icon: <User size={18} /> },
        { name: "Admin Console", href: "/dashboard/admin", icon: <Shield size={18} /> },
      ];
    }
  };

  const navLinks = getNavLinks();

  const accentActive = isAdmin ? "text-teal-600" : "text-emerald-600";
  const badgeCls = isAdmin
    ? "bg-teal-50 text-teal-700 border border-teal-200"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200";
  const rolePillCls = isAdmin
    ? "bg-teal-50 text-teal-700 border border-teal-200"
    : isUser
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-slate-100 text-slate-500";
  const avatarCls = isAdmin
    ? "bg-teal-50 text-teal-700 border-teal-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent tracking-tight"
        >
          LandSync Panel
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            ILMIS
          </span>
          {/* Close button — mobile only */}
          <button
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Role label row */}
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? "Admin Navigation" : isUser ? "Citizen Navigation" : "Console Portal"}
          </span>
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${rolePillCls}`}>
            {isAdmin ? "Admin" : isUser ? "Citizen" : "Select Role"}
          </span>
        </div>

        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                  ? "bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? accentActive : "text-slate-400"}>{link.icon}</span>
                <span className="leading-tight">{link.name}</span>
              </div>
              {link.badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${badgeCls}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider + Shortcuts */}
        <div className="border-t border-slate-100 my-3 pt-3">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            System Shortcuts
          </span>

          {isAdmin && (
            <Link
              href="/dashboard/user"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <ArrowLeftRight size={15} className="shrink-0" />
              <span>Switch to Citizen View</span>
            </Link>
          )}

          {isUser && (
            <Link
              href="/dashboard/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <ArrowLeftRight size={15} className="shrink-0" />
              <span>Switch to Admin View</span>
            </Link>
          )}

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <LogOut size={15} className="shrink-0" />
            <span>Exit to Homepage</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${avatarCls}`}
        >
          {isAdmin ? "AD" : "CF"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{isAdmin ? "Admin Desk #1" : "Aftab Farhan"}</p>
          <p className="text-[10px] text-slate-400 truncate">
            {isAdmin ? "admin@landsync.gov.bd" : "aftab@landsync.gov"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <Link href="/" className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
          LandSync Panel
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${rolePillCls}`}>
            {isAdmin ? "Admin" : isUser ? "Citizen" : "Portal"}
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}