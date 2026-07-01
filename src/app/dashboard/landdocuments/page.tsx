"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetLanddocsQuery, useDeleteLanddocMutation } from "@/redux/api/landdocApiSlice";

export default function LandDocumentsPage() {
  const router = useRouter();

  const { data: responseData, isLoading, error } = useGetLanddocsQuery({});
  const [deleteLanddoc] = useDeleteLanddocMutation();

  const docs = responseData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this land document?")) {
      try {
        await deleteLanddoc(id).unwrap();
        alert("Land document deleted successfully");
      } catch (err: any) {
        console.error("Failed to delete document:", err);
        alert(err?.data?.message || "Failed to delete document");
      }
    }
  };

  return (
    <div className="w-full space-y-8 py-4">
      {/* Header Panel */}
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200/80 p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Land Documents</h1>
          <p className="text-xs text-slate-550 font-medium">Manage and audit registered land records and mutation titles</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/landdocuments/create")}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-650 text-white font-semibold rounded-xl text-sm hover:from-emerald-700 hover:to-teal-750 transition shadow-md shadow-emerald-650/10 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Title
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-55/75 text-slate-505 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200/80">
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Land Details</th>
                <th className="py-4 px-6">Khatian No</th>
                <th className="py-4 px-6">Dag No</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-650 text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2 text-sm font-semibold">
                      <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading documents...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-red-500 font-semibold">
                    Failed to load land documents.
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-450 font-medium space-y-2">
                    <p>No land documents found.</p>
                    <button 
                      onClick={() => router.push("/dashboard/landdocuments/create")}
                      className="text-emerald-600 hover:text-emerald-750 font-bold text-xs underline"
                    >
                      Create your first record
                    </button>
                  </td>
                </tr>
              ) : (
                docs.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{doc.location?.mouza || 'N/A'}</div>
                      <div className="text-xs text-slate-450 mt-0.5">{doc.location?.upazila || 'N/A'}, {doc.location?.district || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {doc.landDetails?.landType || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-bold">
                      {doc.landDetails?.khatianNo || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-slate-650 font-medium">
                      {doc.landDetails?.dagNo || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/landdocuments/${doc.id}`)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-55 transition shadow-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/landdocuments/${doc.id}/edit`)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/70 transition shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
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
