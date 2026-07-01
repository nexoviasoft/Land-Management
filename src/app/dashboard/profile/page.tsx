"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/features/authSlice";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadUserProfilePictureMutation,
} from "@/redux/api/usersApiSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const role = useSelector((state: RootState) => state.auth.role);
  
  const { data: userData, isLoading: isFetching } = useGetUserQuery(authUser?.id, {
    skip: !authUser?.id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadPicture, { isLoading: isUploading }] = useUploadUserProfilePictureMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Nid: "",
    password: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        Nid: user.Nid || "",
        password: "",
      });
    } else if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        Nid: authUser.Nid || "",
        password: "",
      });
    }
  }, [userData, authUser]);

  const user = userData?.data || authUser;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      let pictureUrl = user.picture;

      // Upload picture if a new one is selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await uploadPicture(uploadData).unwrap();
        pictureUrl = uploadRes?.data?.url || uploadRes?.url || "";
      }

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        Nid: formData.Nid,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (pictureUrl !== user.picture) {
        payload.picture = pictureUrl;
      }

      const res = await updateUser({ id: user.id, data: payload }).unwrap();
      
      // Update Redux state with new user data
      if (res?.data && token && role) {
        dispatch(setCredentials({ user: res.data, token, role }));
      }

      alert("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: "" })); // Clear password field
      setFile(null);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert(error?.data?.message || "Failed to update profile.");
    }
  };

  if (!authUser) {
    return <div className="p-6 text-center text-gray-500">Please log in to view your profile.</div>;
  }

  if (isFetching) {
    return <div className="p-6 w-full animate-pulse flex space-x-4">Loading profile...</div>;
  }

  const profileImageUrl = user?.picture?.startsWith("http")
    ? user.picture
    : user?.picture
    ? `http://localhost:8000${user.picture}`
    : "";

  return (
    <div className="w-full p-4 md:p-6 mt-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-650"></div>
        
        <div className="px-6 md:px-8 pb-8 relative">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="flex flex-col sm:flex-row gap-6 items-end sm:items-center -mt-12 mb-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl font-bold relative">
                  {file ? (
                    <Image src={URL.createObjectURL(file)} alt="Preview" layout="fill" objectFit="cover" />
                  ) : profileImageUrl ? (
                    <Image src={profileImageUrl} alt="Profile" layout="fill" objectFit="cover" />
                  ) : (
                    <span>{formData.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                  
                  {/* Hover Overlay for Upload */}
                  <label className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-medium">Change</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
              
              <div className="flex-1 mt-4 sm:mt-12">
                <h1 className="text-2xl font-bold text-slate-805">{user.name}</h1>
                <span className="inline-block mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {user.role} Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-slate-200/85 rounded-xl p-2.5 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-slate-200/85 rounded-xl p-2.5 shadow-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-slate-200/85 rounded-xl p-2.5 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">National ID (NID)</label>
                  <input
                    required
                    type="text"
                    name="Nid"
                    value={formData.Nid}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-slate-200/85 rounded-xl p-2.5 shadow-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Security & Password */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Security</h3>
                
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Update Password
                  </h4>
                  <p className="text-xs text-amber-700 mt-1 mb-4">
                    Leave this field blank if you do not wish to change your password.
                  </p>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="block w-full border border-amber-200/85 rounded-xl p-2.5 shadow-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={isUpdating || isUploading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition shadow-md shadow-emerald-500/10 flex items-center gap-2"
              >
                {isUpdating || isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
