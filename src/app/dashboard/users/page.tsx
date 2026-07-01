"use client";

import React from "react";
import Image from "next/image";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} from "@/redux/api/usersApiSlice";
import UserCreateModal from "./components/UserCreateModal";
import UserEditModal from "./components/UserEditModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "partner" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  Nid: string;
  picture: string | null;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: responseData, error, isLoading } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  const users: User[] = responseData?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const handleToggleBan = async (id: string, isCurrentlyBanned: boolean) => {
    try {
      if (isCurrentlyBanned) {
        await unbanUser(id).unwrap();
      } else {
        await banUser(id).unwrap();
      }
    } catch (error) {
      console.error(error);
      alert(`Error trying to ${isCurrentlyBanned ? "unban" : "ban"} user`);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading users.</div>;
  }

  return (
    <div className="w-full space-y-8 py-4">
      {/* Header Panel */}
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200/80 p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Users Management</h1>
          <p className="text-xs text-slate-500 font-medium">Manage and audit registered user profiles and authority configurations</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl text-sm hover:from-emerald-700 hover:to-teal-700 transition shadow-md shadow-emerald-500/10"
        >
          Add New User
        </button>
      </div>

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-55/75 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200/80">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email / Phone</th>
                <th className="py-4 px-6">NID</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 text-sm divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      {user.picture ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 shadow-sm bg-white shrink-0">
                          <Image
                            src={user.picture.startsWith('http') ? user.picture : `http://localhost:8000${user.picture}`}
                            alt={user.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-700">{user.email}</div>
                      <div className="text-xs text-slate-450 mt-0.5">{user.phone || "No phone added"}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{user.Nid || "—"}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                        user.role === "admin"
                          ? "bg-teal-50 text-teal-700 border-teal-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          user.isBanned
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-red-500" : "bg-emerald-500"}`} />
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-55 transition shadow-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/70 transition shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleBan(user.id, user.isBanned)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition shadow-sm ${
                            user.isBanned
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent"
                              : "bg-amber-50 text-amber-705 border-amber-100 hover:bg-amber-100/70"
                          }`}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                        
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-705 border border-red-100 hover:bg-red-100/70 transition shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
