"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetUserQuery } from "@/redux/api/usersApiSlice";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Calendar,
  Shield,
  Activity,
} from "lucide-react";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: responseData, error, isLoading } = useGetUserQuery(id, {
    skip: !id,
  });

  const user = responseData?.data;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading user details...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-550 flex items-center justify-center border border-red-100">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading details</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          The requested user profile was not found or has been deleted.
        </p>
      </div>
    );
  }

  const profileImageUrl = user.picture?.startsWith("http")
    ? user.picture
    : `https://land-management-api.vercel.app${user.picture}`;

  return (
    <div className="w-full space-y-6 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Back Button and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 text-slate-400 hover:text-slate-700 bg-white/60 hover:bg-white border border-slate-200/50 hover:border-slate-200 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight">
            User Profile
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Registered account information
          </p>
        </div>
      </div>

      {/* Main Glass Profile Card */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/85 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.08)] overflow-hidden">
        {/* Banner Graphic */}
        <div className="bg-gradient-to-r from-brand-orange via-orange-500 to-amber-600 h-36 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        </div>

        <div className="px-6 pb-8 pt-0 sm:px-10 relative">
          {/* Avatar Positioned over the Banner Line - Centered on Mobile, Left-aligned on Desktop */}
          <div className="absolute -top-14 sm:-top-18 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 z-10">
            {user.picture ? (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-white relative">
                <Image
                  src={profileImageUrl}
                  alt={user.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-4xl text-white font-extrabold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Meta (Header details) - Stacked/Centered on Mobile, Row on Desktop */}
          <div className="pt-18 sm:pt-6 sm:pl-48 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-brand-orange border border-orange-100 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
                    user.isBanned
                      ? "bg-rose-50 text-rose-800 border-rose-100"
                      : "bg-orange-50 text-brand-orange border-orange-100"
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  {user.isBanned ? "Banned" : "Active Account"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Fields Sections - 2 Column Grid on Desktop, 1 Column on Mobile */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/35 pt-8">
            
            {/* Email card tile */}
            <div className="group bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 hover:border-brand-orange/20 p-4 rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_20px_rgba(255,96,20,0.04)] transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors duration-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider" style={{ color: "rgb(148, 163, 184)" }}>Email Address</span>
                <p className="text-sm font-semibold text-slate-800 break-all">{user.email}</p>
              </div>
            </div>

            {/* Phone card tile */}
            <div className="group bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 hover:border-brand-orange/20 p-4 rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_20px_rgba(255,96,20,0.04)] transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors duration-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider" style={{ color: "rgb(148, 163, 184)" }}>Phone Number</span>
                <p className="text-sm font-semibold text-slate-800 break-all">{user.phone || "No phone added"}</p>
              </div>
            </div>

            {/* NID card tile */}
            <div className="group bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 hover:border-brand-orange/20 p-4 rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_20px_rgba(255,96,20,0.04)] transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors duration-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider" style={{ color: "rgb(148, 163, 184)" }}>National ID (NID)</span>
                <p className="text-sm font-semibold text-slate-800 break-all">{user.Nid || "—"}</p>
              </div>
            </div>

            {/* Registration Date card tile */}
            <div className="group bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 hover:border-brand-orange/20 p-4 rounded-2xl shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_8px_20px_rgba(255,96,20,0.04)] transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors duration-300 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider" style={{ color: "rgb(148, 163, 184)" }}>Registration Date</span>
                <p className="text-sm font-semibold text-slate-800 break-all">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
