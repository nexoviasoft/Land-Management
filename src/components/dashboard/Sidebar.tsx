"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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

  const role = useSelector((state: RootState) => state.auth.role);

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: <LayoutGrid size={18} /> },
    { name: "Users Management", href: "/dashboard/users", badge: "3", icon: <AlertTriangle size={18} /> },
    { name: "Land Documents", href: "/dashboard/landdocuments", icon: <FileText size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  const partnerLinks = [
    { name: "My Documents", href: "/dashboard/landdocuments", icon: <FileText size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  const navLinks = role === "partner" ? partnerLinks : adminLinks;

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
                <span className={isActive ? "text-emerald-600" : "text-slate-400"}>{link.icon}</span>
                <span className="leading-tight">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          AD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">Admin</p>
          <p className="text-[10px] text-slate-400 truncate">
            admin@landsync.gov.bd
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
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Admin
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