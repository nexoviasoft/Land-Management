"use client";

import React, { useState } from "react";
import {
  useCreateUserMutation,
} from "@/redux/api/usersApiSlice";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import {
  User,
  Mail,
  Phone,
  Hash,
  Lock,
  Shield,
  Upload,
  X,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserCreateModal({
  isOpen,
  onClose,
}: UserCreateModalProps) {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Nid: "",
    password: "",
    role: "partner",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingImage(true);
    try {
      let pictureUrl = "";

      if (file) {
        pictureUrl = await uploadImageToImgBB(file); 
      }

      setIsUploadingImage(false);

      const payload = {
        ...formData,
        ...(pictureUrl && { picture: pictureUrl }),
      };

      await createUser(payload).unwrap();
      alert("User created successfully!");
      handleClose();
    } catch (error: any) {
      setIsUploadingImage(false);
      console.error("Failed to create user:", error);
      alert(error?.data?.message || "Failed to create user");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      Nid: "",
      password: "",
      role: "partner",
    });
    setFile(null);
    setShowPassword(false);
    setIsUploadingImage(false);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-xl w-full max-w-md p-6 md:p-8 max-h-[90vh] overflow-y-auto relative hover:scale-[1.005] transition-transform duration-300">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create New User</h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Add credential details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Name *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Phone Number *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                required
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +8801700000000"
                className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
              />
            </div>
          </div>

          {/* NID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              NID Number *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Hash className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                required
                type="text"
                name="Nid"
                value={formData.Nid}
                onChange={handleChange}
                placeholder="Enter National ID"
                className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10.5 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Shield className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="partner">Partner (অংশীদার)</option>
                <option value="admin">Admin (প্রশাসক)</option>
              </select>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Profile Picture
            </label>
            <div className="border border-dashed border-slate-200 hover:border-emerald-500/50 bg-white/40 hover:bg-emerald-50/10 rounded-2xl p-4 transition-all duration-300 relative group flex items-center justify-center gap-3 text-center cursor-pointer min-h-[80px]">
              {preview ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-600 max-w-[200px] truncate">
                  {file ? file.name : "Choose profile image"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG or PNG (Max 2MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUploadingImage}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
            >
              {isUploadingImage ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : isCreating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
