"use client";

import React, { useState, useEffect } from "react";
import {
  useUpdateUserMutation,
  useUploadUserProfilePictureMutation,
} from "@/redux/api/usersApiSlice";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
}: UserEditModalProps) {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadPicture, { isLoading: isUploading }] =
    useUploadUserProfilePictureMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Nid: "",
    password: "", // Optional during edit
    role: "partner",
  });
  
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        Nid: user.Nid || "",
        password: "", // Keep empty for security, only update if typed
        role: user.role || "partner",
      });
      setFile(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let pictureUrl = user.picture;

      // Only upload a new picture if one was selected
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
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (pictureUrl !== user.picture) {
        payload.picture = pictureUrl;
      }

      await updateUser({ id: user.id, data: payload }).unwrap();
      alert("User updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Failed to update user:", error);
      alert(error?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              required
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              NID *
            </label>
            <input
              required
              type="text"
              name="Nid"
              value={formData.Nid}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-gray-400 font-normal">(Leave blank to keep unchanged)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {user.picture && !file && (
              <p className="mt-1 text-xs text-gray-500 truncate">
                Current picture: {user.picture.split("/").pop()}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isUpdating || isUploading ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
