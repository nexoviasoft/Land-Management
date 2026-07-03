"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import Image from "next/image";
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
  Users,
  Menu,
  X,
  LogOut,
  Sparkles,
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
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const adminLinks: NavLink[] = [
    { name: "Overview", href: "/dashboard/admin", icon: <LayoutGrid size={18} /> },
    { name: "Users Management", href: "/dashboard/users", badge: "3", icon: <Users size={18} /> },
    { name: "Land Documents", href: "/dashboard/landdocuments", icon: <FileText size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  const partnerLinks: NavLink[] = [
    { name: "My Documents", href: "/dashboard/landdocuments", icon: <FileText size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  const navLinks = role === "partner" ? partnerLinks : adminLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between relative">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-orange via-orange-400 to-brand-orange md:hidden" />
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2"
        >
          <Image
            src="/logo2.png"
            alt="LandSync Logo"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            ILMIS
          </span>
          {/* Close button — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-90 transition-all"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${isActive
                ? "bg-gradient-to-r from-brand-orange/10 to-orange-500/5 text-brand-orange shadow-sm border border-brand-orange/10 before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-1 before:bg-gradient-to-b before:from-brand-orange before:to-orange-600 before:rounded-r"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 active:scale-[0.98]"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-orange" : "text-slate-400 group-hover:text-slate-600"}`}>{link.icon}</span>
                <span className="leading-tight">{link.name}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] font-bold text-white bg-gradient-to-br from-brand-orange to-orange-600 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm shadow-brand-orange/30">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {user?.picture ? (
            <div className="w-9 h-9 rounded-full border-2 overflow-hidden relative shrink-0 border-orange-300 bg-white shadow-sm ring-2 ring-orange-50">
              <Image
                src={user.picture.startsWith('http') ? user.picture : `https://land-management-api.vercel.app${user.picture}`}
                alt={user.name || "User"}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 bg-gradient-to-br from-brand-orange to-orange-600 text-white border-orange-200 shadow-sm shadow-brand-orange/20"
            >
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
              {user?.name || 'User'}
              <Sparkles size={11} className="text-brand-orange shrink-0" />
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar (premium glass style) ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-30 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="LandSync Logo"
            width={110}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 text-brand-orange border border-orange-200/70 shadow-sm flex items-center gap-1">
            <Sparkles size={9} className="text-brand-orange" />
            {role === "admin" ? "Admin" : "Citizen"}
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-500 bg-slate-50 hover:text-slate-800 hover:bg-slate-100 active:scale-90 transition-all shadow-sm border border-slate-200/70"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer (premium panel) ── */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[85%] max-w-72 bg-white shadow-[8px_0_40px_-8px_rgba(0,0,0,0.25)] flex flex-col transform transition-transform duration-300 ease-in-out rounded-r-2xl overflow-hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ── Mobile Bottom Navbar (premium glass style) ── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.05)] pb-[safe-area-inset-bottom]">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href;
          // Shorten the labels for premium mobile bottom navbar spacing
          const shortName = link.name === "Users Management" 
            ? "Users" 
            : link.name === "Land Documents" || link.name === "My Documents"
            ? "Docs"
            : link.name;

          return (
            <Link
              key={idx}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3.5 rounded-2xl transition-all duration-355 relative ${
                isActive 
                  ? "text-brand-orange scale-105" 
                  : "text-slate-400 hover:text-slate-700 active:scale-95"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`transition-transform duration-300 ${isActive ? "text-brand-orange" : "text-slate-400"}`}>
                  {link.icon}
                </span>
                {link.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[8px] font-bold text-white bg-gradient-to-r from-brand-orange to-orange-600 rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className={`text-[8px] font-extrabold uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-brand-orange" : "text-slate-400"}`}>
                {shortName}
              </span>
            </Link>
          );
        })}

        {/* ── Mobile Signout Action ── */}
        <button
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
          className="flex flex-col items-center justify-center gap-1.5 py-1 px-3.5 rounded-2xl text-slate-400 hover:text-rose-600 active:scale-95 transition-all duration-300"
          title="Sign Out"
        >
          <div className="relative flex items-center justify-center text-slate-400 hover:text-rose-650">
            <LogOut size={18} />
          </div>
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400">
            Signout
          </span>
        </button>
      </div>
    </>
  );
}