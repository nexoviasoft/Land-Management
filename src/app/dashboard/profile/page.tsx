"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setCredentials } from "@/redux/features/authSlice";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/api/usersApiSlice";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Hash,
  Shield,
  Camera,
  AlertTriangle,
  Save,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const role = useSelector((state: RootState) => state.auth.role);
  
  const { data: userData, isLoading: isFetching } = useGetUserQuery(authUser?.id, {
    skip: !authUser?.id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

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

    const toastId = toast.loading("Updating profile details...");

    try {
      let pictureUrl = user.picture;

      // Upload picture if a new one is selected
      if (file) {
        pictureUrl = await uploadImageToImgBB(file);
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

      toast.success("Profile updated successfully!", { id: toastId });
      setFormData(prev => ({ ...prev, password: "" }));
      setFile(null);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error?.data?.message || "Failed to update profile.", { id: toastId });
    }
  };

  if (!authUser) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Authentication Required</h3>
        <p className="text-xs text-slate-500 max-w-sm">Please log in to view your profile page.</p>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading profile details...</span>
      </div>
    );
  }

  const profileImageUrl = user?.picture?.startsWith("http")
    ? user.picture
    : user?.picture
    ? `https://land-management-api.vercel.app${user.picture}`
    : "";

  return (
    <div className="w-full space-y-6 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Page Title Header */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-white shadow-md shadow-brand-orange/10">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight">
            User Account Profile
          </h2>
          <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">
            Manage your personal credentials, contact details, and secure login settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Profile Card */}
        <div className="lg:col-span-1 bg-white/45 backdrop-blur-xl border border-white/85 rounded-3xl shadow-sm overflow-hidden group">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="px-6 pb-6 relative flex flex-col items-center">
            {/* Avatar block */}
            <div className="relative -mt-14 mb-4 group/avatar">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-orange-50 flex items-center justify-center text-brand-orange text-3xl font-bold relative">
                {file ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                ) : profileImageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{formData.name?.charAt(0)?.toUpperCase()}</span>
                )}
                
                {/* Upload Hover Overlay */}
                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Profile Meta info */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{user.name}</h2>
              <span className="inline-flex items-center px-3 py-0.5 bg-orange-50 text-brand-orange border border-orange-100 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {user.role} Account
              </span>
            </div>

            {/* Readonly details */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-white/50">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-white/50">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                  <Hash className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">National ID (NID)</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{user.Nid || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Settings Form */}
        <div className="lg:col-span-2 bg-white/45 backdrop-blur-xl border border-white/85 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-brand-orange/5 to-orange-500/0 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-sm font-extrabold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-100">
            <User className="w-4.5 h-4.5 text-brand-orange" />
            Update Account Settings
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5 bg-orange-50 border border-orange-100/50 p-3 rounded-2xl">
                <Shield className="w-4 h-4 text-brand-orange shrink-0" />
                Change Password (Optional)
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Leave this field empty if you do not want to change your current password.
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-5 border-t border-slate-200/40 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-orange-600 hover:to-orange-400 text-white font-bold rounded-xl text-xs transition shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/25 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
