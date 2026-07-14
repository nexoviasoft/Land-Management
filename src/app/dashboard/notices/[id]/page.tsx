"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Megaphone } from "lucide-react";
import { useGetNoticeByIdQuery } from "@/redux/api/noticeApiSlice";
import "react-quill-new/dist/quill.bubble.css"; // We use bubble or just raw HTML styling for reading

export default function NoticeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: noticeData, isLoading, error } = useGetNoticeByIdQuery(id, { skip: !id });
  const notice = noticeData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto mt-12 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Notice Not Found</h2>
        <p className="text-slate-500 mb-6">The notice you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.back()}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-orange mb-6 font-semibold transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {notice.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(notice.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
                {notice.isActive && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wide border border-emerald-200">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-8"></div>

          {/* Notice Content (Rendered HTML) */}
          <div 
            className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-brand-orange hover:prose-a:text-orange-600 prose-strong:text-slate-800 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:marker:text-slate-400"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>
      </div>
    </div>
  );
}
