"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetUserQuery } from "@/redux/api/usersApiSlice";

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
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-24 w-24"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 text-red-500">
        Error loading user details or user not found.
      </div>
    );
  }

  const profileImageUrl = user.picture?.startsWith("http")
    ? user.picture
    : `http://localhost:8000${user.picture}`;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-650 h-32"></div>
        <div className="px-6 py-8 sm:p-10 relative">
          <div className="absolute -top-16 left-6 sm:left-10">
            {user.picture ? (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
                <Image
                  src={profileImageUrl}
                  alt={user.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-emerald-50 flex items-center justify-center text-4xl text-emerald-600 font-bold border-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-16 sm:mt-8">
            <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-50 text-slate-650 border border-slate-200/50 rounded-full text-xs font-semibold uppercase tracking-wider">
                {user.role}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  user.isBanned
                    ? "bg-rose-50 text-rose-700 border-rose-100/50"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                }`}
              >
                {user.isBanned ? "Banned" : "Active"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</h3>
                <p className="mt-1 text-base font-semibold text-slate-800">{user.email}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</h3>
                <p className="mt-1 text-base font-semibold text-slate-800">{user.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">National ID (NID)</h3>
                <p className="mt-1 text-base font-semibold text-slate-800">{user.Nid}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</h3>
                <p className="mt-1 text-base font-semibold text-slate-800">
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
