"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Megaphone, Plus, FileText, CheckCircle2 } from "lucide-react";
import { useGetNoticesQuery, useCreateNoticeMutation } from "@/redux/api/noticeApiSlice";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdminNoticesPage() {
  const { data: noticeData, isLoading } = useGetNoticesQuery();
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  
  const notices = noticeData?.data || [];
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await createNotice({ title, content }).unwrap();
      setTitle("");
      setContent("");
      setShowEditor(false);
    } catch (err) {
      console.error("Failed to create notice:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Notice Management</h1>
          <p className="text-slate-500 mt-1">Create and manage public announcements</p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-orange/20 active:scale-95"
        >
          {showEditor ? <span className="flex items-center gap-2">Cancel</span> : <><Plus size={16} /> New Notice</>}
        </button>
      </div>

      {showEditor && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-orange" />
            Compose New Notice
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notice Title (For Marquee & Notifications)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance Tomorrow at 2 PM"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Detailed Content</label>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px]">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  placeholder="Write the full details here..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isCreating || !title.trim() || !content.trim()}
                className="bg-brand-orange hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {isCreating ? "Publishing..." : <><CheckCircle2 size={16} /> Publish Notice</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Notice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Posted</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">Loading notices...</td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 flex flex-col items-center">
                    <FileText className="w-8 h-8 mb-2 text-slate-300" />
                    No notices published yet
                  </td>
                </tr>
              ) : (
                notices.map((notice: any) => (
                  <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      {notice.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {notice.title}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {new Date(notice.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/dashboard/notices/${notice.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-600 font-semibold text-xs rounded-lg transition-colors"
                      >
                        View Details
                      </Link>
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
