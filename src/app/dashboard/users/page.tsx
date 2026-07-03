"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} from "@/redux/api/usersApiSlice";
import UserCreateModal from "./components/UserCreateModal";
import UserEditModal from "./components/UserEditModal";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  UserX,
  Plus,
  Trash2,
  Ban,
  Eye,
  Edit,
  ShieldAlert,
  X,
  Phone,
  Mail,
  FileSpreadsheet,
  UserCheck,
} from "lucide-react";

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

// Custom Delete Confirmation Modal Component
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-sm shadow-xl mx-4 relative hover:scale-[1.01] transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-650 flex items-center justify-center shadow-inner">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">Delete User</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{userName}</span>? This action is permanent and cannot be undone.
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-500/10 active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Ban/Unban Confirmation Modal Component
function BanConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isBanned,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isBanned: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-sm shadow-xl mx-4 relative hover:scale-[1.01] transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
            isBanned ? "bg-orange-50 text-brand-orange" : "bg-amber-50 text-amber-600"
          }`}>
            {isBanned ? <UserCheck className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">
              {isBanned ? "Unban User" : "Ban User"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to {isBanned ? "unban" : "ban"}{" "}
              <span className="font-semibold text-slate-700">{userName}</span>?{" "}
              {isBanned
                ? "This will restore their access to the system immediately."
                : "This will revoke their access to the system immediately."}
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 ${
                isBanned
                  ? "bg-brand-orange hover:bg-orange-600 shadow-orange-500/10"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/10"
              }`}
            >
              {isBanned ? "Unban" : "Ban"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // States for confirmation modals
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [banTarget, setBanTarget] = useState<User | null>(null);

  const { data: responseData, error, isLoading } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  const users: User[] = responseData?.data || [];

  // Computed stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBanned).length;
  const bannedUsers = users.filter((u) => u.isBanned).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const handleConfirmToggleBan = async () => {
    if (!banTarget) return;
    try {
      if (banTarget.isBanned) {
        await unbanUser(banTarget.id).unwrap();
      } else {
        await banUser(banTarget.id).unwrap();
      }
      setBanTarget(null);
    } catch (error) {
      console.error(error);
      alert(`Error trying to ${banTarget.isBanned ? "unban" : "ban"} user`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading users</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/90 p-5 sm:p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(255,96,20,0.04)] transition-all duration-500 group">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-orange/10 to-orange-500/0 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-orange-500/5 to-brand-orange/0 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-white shadow-md shadow-brand-orange/10 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight">
              Users Management
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Manage, audit, and configure user profiles and dashboard authorities
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="relative z-10 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-orange-600 hover:to-orange-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4.5 h-4.5 animate-pulse" />
          Add New User
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsers, icon: Users, color: "from-brand-orange to-orange-500", glow: "group-hover:bg-brand-orange/5", border: "hover:border-brand-orange/20" },
          { label: "Active Users", value: activeUsers, icon: ShieldCheck, color: "from-orange-500 to-amber-500", glow: "group-hover:bg-orange-500/5", border: "hover:border-orange-500/20" },
          { label: "Banned Users", value: bannedUsers, icon: Ban, color: "from-rose-500 to-red-600", glow: "group-hover:bg-rose-500/5", border: "hover:border-rose-500/20" },
          { label: "Admins", value: adminUsers, icon: ShieldAlert, color: "from-orange-600 to-amber-600", glow: "group-hover:bg-orange-600/5", border: "hover:border-orange-600/20" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`group bg-white/50 backdrop-blur-xl border border-white/95 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] ${stat.border} relative overflow-hidden`}
          >
            {/* Hover color glow layer */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.glow} pointer-events-none`} />
            
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
            </div>
            
            <div className={`relative z-10 w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md shadow-slate-200/50 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300`}>
              <stat.icon className="w-5.5 h-5.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Users List Container */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/85 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.08)] overflow-hidden">
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200/40">
                <th className="py-4.5 px-6">Name</th>
                <th className="py-4.5 px-6">Email & Phone</th>
                <th className="py-4.5 px-6">NID</th>
                <th className="py-4.5 px-6">Role</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 text-sm divide-y divide-slate-100/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/30 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {user.picture ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 shadow-sm bg-white shrink-0">
                          <Image
                            src={user.picture.startsWith("http") ? user.picture : `https://land-management-api.vercel.app${user.picture}`}
                            alt={user.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-orange-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">{user.Nid || "—"}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-orange-50 text-brand-orange border-orange-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.isBanned
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-orange-50 text-brand-orange border-orange-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-red-500 animate-pulse" : "bg-brand-orange"}`} />
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-50/40 text-brand-orange border border-orange-200/50 hover:bg-orange-100/70 transition shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setBanTarget(user)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition shadow-sm flex items-center gap-1 active:scale-95 ${
                            user.isBanned
                              ? "bg-brand-orange text-white hover:bg-orange-600 border-transparent"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70"
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

        {/* Mobile Card List View */}
        <div className="block md:hidden p-4 space-y-4">
          {users.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-semibold bg-white/20 rounded-2xl">
              No users found.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white/50 backdrop-blur-md border border-white/60 p-5 rounded-2xl space-y-4 shadow-sm relative hover:border-brand-orange/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {user.picture ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border border-slate-200 shadow-sm bg-white shrink-0">
                      <Image
                        src={user.picture.startsWith("http") ? user.picture : `https://land-management-api.vercel.app${user.picture}`}
                        alt={user.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-orange to-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-orange-50 text-brand-orange border-orange-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        user.isBanned
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-orange-50 text-brand-orange border-orange-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-red-500" : "bg-brand-orange"}`} />
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-200/30 pt-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.Nid && (
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>NID: {user.Nid}</span>
                    </div>
                  )}
                </div>

                {/* Actions grid for mobile */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/30">
                  <button
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                    className="py-2.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="py-2.5 text-xs font-bold rounded-xl bg-orange-50/40 text-brand-orange border border-orange-200/50 hover:bg-orange-100/70 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit User
                  </button>
                  <button
                    onClick={() => setBanTarget(user)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition shadow-sm flex items-center justify-center gap-1 active:scale-95 ${
                      user.isBanned
                        ? "bg-brand-orange text-white hover:bg-orange-600 border-transparent col-span-2"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70"
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    {user.isBanned ? "Unban" : "Ban User"}
                  </button>
                  {!user.isBanned && (
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="py-2.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Create Modal */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        userName={deleteTarget?.name || ""}
      />

      {/* Ban Confirmation Modal */}
      <BanConfirmModal
        isOpen={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={handleConfirmToggleBan}
        userName={banTarget?.name || ""}
        isBanned={banTarget?.isBanned || false}
      />
    </div>
  );
}
