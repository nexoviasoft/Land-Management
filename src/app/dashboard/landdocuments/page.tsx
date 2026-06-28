"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetLanddocsQuery, useDeleteLanddocMutation } from "@/redux/api/landdocApiSlice";
import Create from "./components/Create";
import Edit from "./components/Edit";

export default function LandDocumentsPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Land Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your land records and documents</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Record
        </button>
      </div>

      <Create isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      
      {editingDoc && (
        <Edit isOpen={!!editingDoc} onClose={() => setEditingDoc(null)} docId={editingDoc.id} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Land Details</th>
                <th className="px-6 py-4">Khatian No</th>
                <th className="px-6 py-4">Dag No</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading documents...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    Failed to load land documents.
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>No land documents found.</p>
                    <button 
                      onClick={() => setIsCreateOpen(true)}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Create your first record
                    </button>
                  </td>
                </tr>
              ) : (
                docs.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{doc.location.mouza}</div>
                      <div className="text-xs text-gray-500">{doc.location.upazila}, {doc.location.district}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.landDetails.landType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {doc.landDetails.khatianNo}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {doc.landDetails.dagNo}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/landdocuments/${doc.id}`)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingDoc(doc)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
