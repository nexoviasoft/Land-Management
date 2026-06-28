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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-900 transition"
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
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
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
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-16 sm:mt-8">
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isBanned
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.isBanned ? "Banned" : "Active"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="mt-1 text-base text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1 text-base text-gray-900">{user.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">National ID (NID)</h3>
                <p className="mt-1 text-base text-gray-900">{user.Nid}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-base text-gray-900">
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
