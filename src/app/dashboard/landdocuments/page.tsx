"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { useGetLanddocsQuery, useDeleteLanddocMutation } from "@/redux/api/landdocApiSlice";
import { useGetUsersQuery } from "@/redux/api/usersApiSlice";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  MapPin,
  Tag,
  FileText,
  AlertTriangle,
  X,
  Building,
  Home,
  CheckCircle2,
  Clock,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-xl w-full max-w-md p-6 relative hover:scale-[1.005] transition-transform duration-300 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Permanent Action</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete this land document record? This action cannot be undone.
          </p>
          <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-0.5">Record to delete:</span>
            <p className="text-xs font-semibold text-rose-950 break-all">{itemName}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-500/10 hover:shadow-red-500/25 active:scale-[0.98]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandDocumentsPage() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: responseData, isLoading, error } = useGetLanddocsQuery({});
  const [deleteLanddoc] = useDeleteLanddocMutation();
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const { data: usersData } = useGetUsersQuery({});
  const usersList = usersData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("all");

  const allDocs = responseData?.data || [];

  // 1. Filter by role/user
  let baseDocs = role === "partner" && user?.id
    ? allDocs.filter((doc: any) =>
      String(doc.userId) === String(user.id) ||
      String(doc.user) === String(user.id) ||
      (doc.user && typeof doc.user === "object" && (String(doc.user.id) === String(user.id) || String(doc.user._id) === String(user.id)))
    )
    : allDocs;

  // 2. Filter by User ID (admin dropdown)
  if (selectedUserId !== "all") {
    baseDocs = baseDocs.filter((doc: any) => 
      String(doc.userId) === String(selectedUserId) || 
      String(doc.user) === String(selectedUserId) || 
      (doc.user && typeof doc.user === "object" && (String(doc.user.id) === String(selectedUserId) || String(doc.user._id) === String(selectedUserId)))
    );
  }

  // 3. Search Filter
  let docsBeforeStatus = baseDocs;
  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    docsBeforeStatus = baseDocs.filter((doc: any) => {
      const mouzaMatch = doc.location?.mouza?.toLowerCase().includes(lowerTerm);
      const upazilaMatch = doc.location?.upazila?.toLowerCase().includes(lowerTerm);
      const districtMatch = doc.location?.district?.toLowerCase().includes(lowerTerm);
      const dagMatch = doc.landDetails?.dagNo?.toLowerCase().includes(lowerTerm);
      const khatianMatch = doc.landDetails?.khatianNo?.toLowerCase().includes(lowerTerm);
      return mouzaMatch || upazilaMatch || districtMatch || dagMatch || khatianMatch;
    });
  }

  // Calculate counts based on current filters (excluding status)
  const tabCounts: Record<string, number> = {
    all: docsBeforeStatus.length,
    pending: docsBeforeStatus.filter((d: any) => d.status === "pending").length,
    approved: docsBeforeStatus.filter((d: any) => d.status === "approved").length,
    rejected: docsBeforeStatus.filter((d: any) => d.status === "rejected").length,
  };

  // 4. Apply Status Filter
  let docs = docsBeforeStatus;
  if (statusTab !== "all") {
    docs = docsBeforeStatus.filter((doc: any) => doc.status === statusTab);
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading("Deleting document...");
    try {
      await deleteLanddoc(deleteTarget.id).unwrap();
      toast.success("Document deleted successfully!", { id: toastId });
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Failed to delete document:", err);
      toast.error(err?.data?.message || "Failed to delete document", { id: toastId });
      setDeleteTarget(null);
    }
  };

  // Stat calculations
  const totalDocs = docs.length;
  const agriDocs = docs.filter((doc: any) => doc.landDetails?.landType === "Agricultural").length;
  const commIndDocs = docs.filter(
    (doc: any) => doc.landDetails?.landType === "Commercial" || doc.landDetails?.landType === "Industrial"
  ).length;
  const resDocs = docs.filter((doc: any) => doc.landDetails?.landType === "Residential").length;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading land documents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading documents</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Please check your network and backend api status.
        </p>
      </div>
    );
  }
  // oiuuwhjefu9hwe9ufghe9hj9i
  return (
    <div className="w-full space-y-8 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/90 p-5 sm:p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(255,96,20,0.04)] transition-all duration-500 group">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-orange/10 to-orange-500/0 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-amber-500/5 to-brand-orange/0 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-white shadow-md shadow-brand-orange/10 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight">
              Land Documents
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Manage and audit registered land records and mutation titles
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/landdocuments/create")}
          className="relative z-10 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange-hover hover:to-orange-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 group/btn shrink-0"
        >
          <Plus className="w-4.5 h-4.5 transition-transform duration-300 group-hover/btn:rotate-90" />
          Add New Land
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: totalDocs, icon: FileText, color: "from-brand-orange to-orange-500", glow: "group-hover:bg-brand-orange/5", border: "hover:border-brand-orange/20" },
          { label: "Agricultural Land", value: agriDocs, icon: Tag, color: "from-orange-500 to-amber-500", glow: "group-hover:bg-orange-500/5", border: "hover:border-orange-500/20" },
          { label: "Commercial/Industrial", value: commIndDocs, icon: Building, color: "from-orange-600 to-brand-orange", glow: "group-hover:bg-brand-orange/5", border: "hover:border-brand-orange/20" },
          { label: "Residential", value: resDocs, icon: Home, color: "from-amber-600 to-brand-orange", glow: "group-hover:bg-brand-orange/5", border: "hover:border-brand-orange/20" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`group bg-white/50 backdrop-blur-xl border border-white/95 p-3.5 sm:p-5 rounded-3xl shadow-sm flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] ${stat.border} relative overflow-hidden`}
          >
            {/* Hover color glow layer */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.glow} pointer-events-none`} />

            <div className="space-y-0.5 sm:space-y-1 relative z-10 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">{stat.label}</span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{stat.value}</p>
            </div>

            <div className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md shadow-slate-200/50 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
              <stat.icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/85 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Status Tabs */}
        <div className="flex bg-white/60 p-1.5 rounded-2xl shadow-inner border border-slate-200/50 w-full md:w-auto overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusTab === tab
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                statusTab === tab 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-200/70 text-slate-500"
              }`}>
                {tabCounts[tab] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* User Filter (Admins only) */}
          {(role === "admin" || role === "superadmin") && (
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none appearance-none transition-all shadow-sm cursor-pointer"
              >
                <option value="all">All Users</option>
                {usersList.map((u: any) => (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.name || u.email || "Unknown User"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by mouza, dag, khatian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/85 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.08)] overflow-hidden">

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/35">
                <th className="py-4.5 px-6">Location</th>
                <th className="py-4.5 px-6">Land Details</th>
                <th className="py-4.5 px-6">Khatian No</th>
                <th className="py-4.5 px-6">Dag No</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 text-sm divide-y divide-slate-200/25">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-medium space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">No land documents found</p>
                      <p className="text-xs text-slate-500">Get started by creating your first document.</p>
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/landdocuments/create")}
                      className="px-4 py-2 bg-orange-50 text-brand-orange border border-orange-100 hover:bg-orange-100/70 font-bold text-xs rounded-xl transition"
                    >
                      Create first record
                    </button>
                  </td>
                </tr>
              ) : (
                docs.map((doc: any) => {
                  let badgeStyles = "bg-slate-50 text-slate-600 border-slate-200";
                  if (doc.landDetails?.landType === "Agricultural") badgeStyles = "bg-orange-50 text-brand-orange border-orange-100";
                  else if (doc.landDetails?.landType === "Residential") badgeStyles = "bg-amber-50 text-amber-700 border-amber-100";
                  else if (doc.landDetails?.landType === "Commercial") badgeStyles = "bg-yellow-50 text-yellow-700 border-yellow-100";
                  else if (doc.landDetails?.landType === "Industrial") badgeStyles = "bg-orange-100 text-brand-orange border-orange-200";

                  let statusStyles = "bg-slate-50 text-slate-600 border-slate-200";
                  if (doc.status === "approved") statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  else if (doc.status === "pending") statusStyles = "bg-amber-50 text-amber-700 border-amber-100";
                  else if (doc.status === "rejected") statusStyles = "bg-rose-50 text-rose-700 border-rose-100";

                  return (
                    <tr key={doc.id} className="hover:bg-white/60 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                          {doc.location?.mouza || 'N/A'}
                        </div>
                        <div className="text-xs text-slate-400 pl-5 mt-0.5">
                          {doc.location?.upazila || 'N/A'}, {doc.location?.district || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeStyles}`}>
                          {doc.landDetails?.landType || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-bold">
                        {doc.landDetails?.khatianNo || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">
                        {doc.landDetails?.dagNo || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusStyles}`}>
                          {doc.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/landdocuments/${doc.id}`)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-1 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/landdocuments/${doc.id}/edit`)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-50/40 text-brand-orange border border-orange-200/50 hover:bg-orange-100/70 transition shadow-sm flex items-center gap-1 active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(doc)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center gap-1 active:scale-95"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-slate-200/25 p-4 space-y-4">
          {docs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium space-y-3 bg-white/30 rounded-2xl border border-white/60">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">No land documents found</p>
                <p className="text-xs text-slate-500">Get started by creating your first document.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/landdocuments/create")}
                className="px-4 py-2 bg-orange-50 text-brand-orange border border-orange-100 hover:bg-orange-100/70 font-bold text-xs rounded-xl transition"
              >
                Create first record
              </button>
            </div>
          ) : (
            docs.map((doc: any) => {
              let badgeStyles = "bg-slate-50 text-slate-600 border-slate-200";
              if (doc.landDetails?.landType === "Agricultural") badgeStyles = "bg-orange-50 text-brand-orange border-orange-100";
              else if (doc.landDetails?.landType === "Residential") badgeStyles = "bg-amber-50 text-amber-700 border-amber-100";
              else if (doc.landDetails?.landType === "Commercial") badgeStyles = "bg-yellow-50 text-yellow-700 border-yellow-100";
              else if (doc.landDetails?.landType === "Industrial") badgeStyles = "bg-orange-100 text-brand-orange border-orange-200";

              let statusStyles = "bg-slate-50 text-slate-600 border-slate-200";
              if (doc.status === "approved") statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-100";
              else if (doc.status === "pending") statusStyles = "bg-amber-50 text-amber-700 border-amber-100";
              else if (doc.status === "rejected") statusStyles = "bg-rose-50 text-rose-700 border-rose-100";

              return (
                <div
                  key={doc.id}
                  className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 p-4.5 space-y-4.5 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:-translate-y-1 hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Location and Badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-orange" />
                        {doc.location?.mouza || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400 pl-5.5">
                        {doc.location?.upazila || 'N/A'}, {doc.location?.district || 'N/A'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${statusStyles}`}>
                        {doc.status || 'pending'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border ${badgeStyles}`}>
                        {doc.landDetails?.landType || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Document Grid */}
                  <div className="grid grid-cols-2 gap-3.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Khatian No</span>
                      <p className="text-xs font-bold text-slate-700">{doc.landDetails?.khatianNo || '—'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dag No</span>
                      <p className="text-xs font-bold text-slate-700">{doc.landDetails?.dagNo || '—'}</p>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => router.push(`/dashboard/landdocuments/${doc.id}`)}
                      className="py-2 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/landdocuments/${doc.id}/edit`)}
                      className="py-2 text-xs font-bold rounded-xl bg-orange-50/40 text-brand-orange border border-orange-200/50 hover:bg-orange-100/70 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(doc)}
                      className="py-2 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={`Mouza: ${deleteTarget.location?.mouza || "N/A"} (Khatian No: ${deleteTarget.landDetails?.khatianNo || "N/A"})`}
        />
      )}
    </div>
  );
}
