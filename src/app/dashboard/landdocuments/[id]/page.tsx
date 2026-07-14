"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLanddocQuery, useApproveLanddocMutation, useRejectLanddocMutation } from "@/redux/api/landdocApiSlice";
import { useGetUsersQuery } from "@/redux/api/usersApiSlice";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Download,
  Eye,
  MapPin,
  Tag,
  FileText,
  Calendar,
  Layers,
  Grid,
  FileSpreadsheet,
  Map,
  Navigation,
  Locate,
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Phone,
  Shield
} from "lucide-react";

export default function LandDocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: responseData, error, isLoading } = useGetLanddocQuery(id, {
    skip: !id,
  });

  const role = useSelector((state: RootState) => state.auth.role);
  const { data: usersData } = useGetUsersQuery({});
  const usersList = usersData?.data || [];
  const [approveLanddoc, { isLoading: isApproving }] = useApproveLanddocMutation();
  const [rejectLanddoc, { isLoading: isRejecting }] = useRejectLanddocMutation();
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Land_Document_${id}`,
  });

  const handleApprove = async () => {
    try {
      await approveLanddoc(id).unwrap();
      toast.success("Document approved successfully!");
    } catch (error) {
      toast.error("Failed to approve document.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectLanddoc(id).unwrap();
      toast.success("Document rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject document.");
    }
  };

  const landdoc = responseData?.data;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading document details...</span>
      </div>
    );
  }

  if (error || !landdoc) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading document</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          The requested land document could not be found or has been deleted.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { location, landDetails, documents, createdAt } = landdoc;

  const creator = usersList.find((u: any) => String(u.id) === String(landdoc?.userId) || String(u._id) === String(landdoc?.userId) || String(u.id) === String(landdoc?.user) || String(u._id) === String(landdoc?.user));
  const creatorName = creator ? (creator.name || creator.fullName || creator.email) : "Unknown User";

  const getFullUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://land-management-api.vercel.app${url}`;
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownloadAll = async () => {
    const filesToDownload: { title: string; url: string }[] = [];

    if (documents?.khatianCopyUrl) {
      filesToDownload.push({ title: "Khatian_Copy", url: getFullUrl(documents.khatianCopyUrl) });
    }
    if (documents?.kharijCopyUrl) {
      filesToDownload.push({ title: "Kharij_Copy", url: getFullUrl(documents.kharijCopyUrl) });
    }
    if (documents?.otherRecord) {
      documents.otherRecord.forEach((record: any, index: number) => {
        if (record.url) {
          filesToDownload.push({ 
            title: (record.name || `Other_Record_${index + 1}`).replace(/\s+/g, '_'), 
            url: getFullUrl(record.url) 
          });
        }
      });
    }

    if (filesToDownload.length === 0) {
      toast.warning("No files available to download.");
      return;
    }

    const toastId = toast.loading("Preparing files for download...");
    let downloadedCount = 0;
    let failedCount = 0;

    for (const file of filesToDownload) {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        
        let extension = "pdf";
        if (blob.type.includes("image/jpeg")) extension = "jpg";
        else if (blob.type.includes("image/png")) extension = "png";
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${file.title}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        
        downloadedCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Failed to download file:", file.url, error);
        failedCount++;
      }
    }

    if (failedCount === 0) {
      toast.success(`Successfully downloaded all ${downloadedCount} files!`, { id: toastId });
    } else if (downloadedCount > 0) {
      toast.warning(`Downloaded ${downloadedCount} files, but ${failedCount} files failed.`, { id: toastId });
    } else {
      toast.error("Failed to download files.", { id: toastId });
    }
  };

  const DocumentCard = ({ title, url }: { title: string; url: string }) => {
    if (!url) return null;
    const fullUrl = getFullUrl(url);
    const isImage = fullUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;

    const handleSingleDownload = async (e: React.MouseEvent) => {
      e.preventDefault();
      const toastId = toast.loading(`Downloading ${title}...`);
      try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        
        let extension = "pdf";
        if (blob.type.includes("image/jpeg")) extension = "jpg";
        else if (blob.type.includes("image/png")) extension = "png";
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${title.replace(/\s+/g, '_')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        toast.success(`${title} downloaded successfully!`, { id: toastId });
      } catch (error) {
        console.error("Failed to download file:", fullUrl, error);
        toast.error(`Failed to download ${title}.`, { id: toastId });
      }
    };

    return (
      <div className="group border border-slate-200/80 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all duration-300 flex flex-col hover:-translate-y-0.5">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h4 className="font-bold text-slate-700 truncate max-w-full sm:max-w-[45%] text-xs uppercase tracking-wider">{title}</h4>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleSingleDownload}
              className="text-brand-orange hover:text-white text-xs font-bold flex items-center gap-1.5 bg-orange-50 hover:bg-brand-orange border border-orange-100/50 hover:border-brand-orange px-3.5 py-1.5 rounded-xl transition-all w-full sm:w-auto justify-center active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-white text-xs font-bold flex items-center gap-1.5 bg-amber-50 hover:bg-amber-600 border border-amber-100/50 hover:border-amber-600 px-3.5 py-1.5 rounded-xl transition-all w-full sm:w-auto justify-center active:scale-95 shadow-sm"
            >
              <span>View</span>
              <Eye className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        
        {/* Preview Container */}
        <div className="h-44 w-full bg-slate-50/50 flex items-center justify-center relative overflow-hidden">
          {isImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={fullUrl} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : fullUrl.toLowerCase().endsWith('.pdf') ? (
            <iframe 
              src={`${fullUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full border-none pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
              title={title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-orange transition-colors duration-300">
              <FileText className="w-12 h-12 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Document PDF/File</span>
            </div>
          )}
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full space-y-6 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Status Stamps */}
      {landdoc.status === 'approved' && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 transform rotate-12 pointer-events-none opacity-80">
          <div className="border-[4px] md:border-[6px] border-emerald-500 text-emerald-500 text-2xl md:text-5xl font-black uppercase tracking-widest px-4 md:px-6 py-1 md:py-2 rounded-xl bg-emerald-500/10 backdrop-blur-sm shadow-xl flex items-center gap-2 md:gap-3">
            <CheckCircle2 className="w-6 h-6 md:w-12 md:h-12" />
            APPROVED
          </div>
        </div>
      )}
      {landdoc.status === 'rejected' && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 transform -rotate-12 pointer-events-none opacity-80">
          <div className="border-[4px] md:border-[6px] border-rose-500 text-rose-500 text-2xl md:text-5xl font-black uppercase tracking-widest px-4 md:px-6 py-1 md:py-2 rounded-xl bg-rose-500/10 backdrop-blur-sm shadow-xl flex items-center gap-2 md:gap-3">
            <XCircle className="w-6 h-6 md:w-12 md:h-12" />
            REJECTED
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                confirmAction === 'approve' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'
              }`}>
                {confirmAction === 'approve' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Confirm {confirmAction === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to {confirmAction} this land document? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction === 'approve') handleApprove();
                    if (confirmAction === 'reject') handleReject();
                    setConfirmAction(null);
                  }}
                  className={`flex-1 py-3 px-4 text-white font-bold rounded-xl transition-colors ${
                    confirmAction === 'approve' 
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25 shadow-lg' 
                      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25 shadow-lg'
                  }`}
                >
                  Yes, {confirmAction === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/90 group relative overflow-hidden hover:border-brand-orange/25 transition-colors">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-brand-orange/10 to-amber-500/0 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="p-2.5 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white border border-slate-200/50 hover:border-slate-200 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center shrink-0 print:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 bg-clip-text text-transparent tracking-tight flex items-center gap-2.5 flex-wrap">
              Land Document
              <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-brand-orange border border-orange-100 text-[10px] font-extrabold uppercase tracking-wider rounded-xl">
                {landDetails?.landType || "Unknown Type"}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1 flex items-center gap-1.5 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Registered: {formatDate(createdAt)}
              <span className="mx-1 text-slate-300">•</span>
              <User className="w-3.5 h-3.5 text-slate-400" />
              By: {creatorName}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto relative z-10 flex-col sm:flex-row mt-4 md:mt-0 print:hidden">
          {role === "admin" && landdoc.status === "pending" && (
            <>
              <button
                onClick={() => setConfirmAction('approve')}
                disabled={isApproving || isRejecting}
                className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 active:scale-95 disabled:opacity-70"
              >
                <CheckCircle2 className={`w-4 h-4 ${isApproving ? 'animate-pulse' : ''}`} />
                {isApproving ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => setConfirmAction('reject')}
                disabled={isApproving || isRejecting}
                className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-rose-500/10 hover:shadow-rose-500/25 transition-all duration-300 active:scale-95 disabled:opacity-70"
              >
                <XCircle className={`w-4 h-4 ${isRejecting ? 'animate-pulse' : ''}`} />
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </>
          )}
          
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 hover:shadow-slate-900/25 transition-all duration-300 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          
          <button
            onClick={handleDownloadAll}
            className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange-hover hover:to-orange-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/25 transition-all duration-300 active:scale-95"
          >
            <Download className="w-4 h-4 animate-pulse" />
            Download All Files
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details (Location & Identifiers) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Location Card */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <MapPin className="w-28 h-28 text-slate-800" />
            </div>
            
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <MapPin className="w-4.5 h-4.5 text-brand-orange" />
              Location Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              
              <div className="group/tile bg-white/40 border border-white/50 p-3 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2 mb-1">
                  <Map className="w-4 h-4 text-slate-400 group-hover/tile:text-brand-orange transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Division</span>
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{location?.division || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/50 p-3 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover/tile:text-brand-orange transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">District</span>
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{location?.district || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/50 p-3 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-slate-400 group-hover/tile:text-brand-orange transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Upazila</span>
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{location?.upazila || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/50 p-3 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2 mb-1">
                  <Locate className="w-4 h-4 text-slate-400 group-hover/tile:text-brand-orange transition-colors" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mouza</span>
                </div>
                <p className="text-xs font-bold text-slate-700 truncate">{location?.mouza || "—"}</p>
              </div>

            </div>
          </div>

          {/* Land Identifiers Card */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <FileText className="w-28 h-28 text-slate-800" />
            </div>
            
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <Tag className="w-4.5 h-4.5 text-brand-orange" />
              Land Identifiers
            </h3>
            
            <div className="space-y-3 relative z-10">
              
              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khatian No.</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750">{landDetails?.khatianNo || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <Grid className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dag No.</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750">{landDetails?.dagNo || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Kharij Case No.</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750 truncate max-w-[50%]">{landDetails?.kharijCaseNo || "—"}</p>
              </div>

            </div>
          </div>

          {/* User Information Card */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <User className="w-28 h-28 text-slate-800" />
            </div>
            
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <User className="w-4.5 h-4.5 text-brand-orange" />
              Creator Information
            </h3>
            
            <div className="space-y-3 relative z-10">
              
              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750">{creatorName}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750 truncate max-w-[60%]">{creator?.email || "—"}</p>
              </div>

              <div className="group/tile bg-white/40 border border-white/55 p-3 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/80 hover:border-brand-orange/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-50 text-slate-400 group-hover/tile:text-brand-orange group-hover/tile:bg-orange-50 rounded-xl transition-colors shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
                </div>
                <p className="text-sm font-extrabold text-slate-750 uppercase">{creator?.role || "—"}</p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Documents Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 rounded-3xl shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-extrabold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-100 shrink-0">
              <FolderOpen className="w-5 h-5 text-brand-orange" />
              Document Gallery
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {documents?.khatianCopyUrl && (
                <DocumentCard title="Khatian Copy" url={documents.khatianCopyUrl} />
              )}
              {documents?.kharijCopyUrl && (
                <DocumentCard title="Kharij Copy" url={documents.kharijCopyUrl} />
              )}
              
              {documents?.otherRecord && documents.otherRecord.map((record: any, index: number) => (
                <DocumentCard 
                  key={index} 
                  title={record.name || `Other Record ${index + 1}`} 
                  url={record.url} 
                />
              ))}

              {!documents?.khatianCopyUrl && !documents?.kharijCopyUrl && (!documents?.otherRecord || documents?.otherRecord?.length === 0) && (
                <div className="col-span-1 sm:col-span-2 text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                  <FileText className="w-10 h-10 text-slate-350" />
                  <p className="text-sm font-semibold text-slate-500">No documents attached to this record.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Hidden Dedicated Print Layout */}
    <div className="hidden">
        <div ref={printRef} className="p-12 bg-white text-slate-800 font-sans min-h-screen">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b-2 border-slate-800 pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Land Document Record</h1>
              <p className="text-sm font-semibold text-slate-500 mt-2">Document ID: {id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600">Registered On</p>
              <p className="text-lg font-bold text-slate-900">{formatDate(createdAt)}</p>
            </div>
          </div>

          {/* Status Stamp for Print */}
          {landdoc.status !== 'pending' && (
            <div className="absolute top-12 right-1/2 transform translate-x-1/2 rotate-12 opacity-20 pointer-events-none flex justify-center w-full">
              <div className={`border-[10px] text-[80px] font-black uppercase tracking-[0.2em] px-12 py-4 rounded-3xl ${
                landdoc.status === 'approved' ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
              }`}>
                {landdoc.status}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-12 relative z-10">
            {/* Location */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-800" /> Location Information
              </h2>
              <div className="space-y-4">
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Division</span>
                  <span className="w-2/3 font-bold text-slate-900">{location?.division || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">District</span>
                  <span className="w-2/3 font-bold text-slate-900">{location?.district || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Upazila</span>
                  <span className="w-2/3 font-bold text-slate-900">{location?.upazila || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Mouza</span>
                  <span className="w-2/3 font-bold text-slate-900">{location?.mouza || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Identifiers */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-slate-800" /> Land Identifiers
              </h2>
              <div className="space-y-4">
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Land Type</span>
                  <span className="w-2/3 font-bold text-slate-900 uppercase">{landDetails?.landType || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Khatian No.</span>
                  <span className="w-2/3 font-bold text-slate-900">{landDetails?.khatianNo || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Dag No.</span>
                  <span className="w-2/3 font-bold text-slate-900">{landDetails?.dagNo || "N/A"}</span>
                </div>
                <div className="flex border-b border-slate-200 pb-2">
                  <span className="w-1/3 font-semibold text-slate-500">Kharij Case</span>
                  <span className="w-2/3 font-bold text-slate-900">{landDetails?.kharijCaseNo || "N/A"}</span>
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="mt-8 col-span-2">
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-800" /> Creator Information
              </h2>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex border-b border-slate-200 pb-2">
                    <span className="w-1/3 font-semibold text-slate-500">Name</span>
                    <span className="w-2/3 font-bold text-slate-900">{creatorName}</span>
                  </div>
                  <div className="flex border-b border-slate-200 pb-2">
                    <span className="w-1/3 font-semibold text-slate-500">Email</span>
                    <span className="w-2/3 font-bold text-slate-900">{creator?.email || "N/A"}</span>
                  </div>
                  <div className="flex border-b border-slate-200 pb-2">
                    <span className="w-1/3 font-semibold text-slate-500">Role</span>
                    <span className="w-2/3 font-bold text-slate-900 uppercase">{creator?.role || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Attached Documents for Print */}
          {(documents?.khatianCopyUrl || documents?.kharijCopyUrl || (documents?.otherRecord && documents?.otherRecord.length > 0)) && (
            <div className="mt-12 break-before-page">
              <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 border-b-2 border-slate-200 pb-2">
                <FolderOpen className="w-5 h-5 text-slate-800" /> Attached Documents
              </h2>
              <div className="space-y-8">
                {documents?.khatianCopyUrl && (
                  <div className="mb-8">
                    <h3 className="font-bold text-slate-700 mb-2">Khatian Copy</h3>
                    {documents.khatianCopyUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={getFullUrl(documents.khatianCopyUrl)} alt="Khatian Copy" className="max-w-full h-auto border border-slate-200 rounded-lg max-h-[800px] object-contain" />
                    ) : (
                      <p className="text-sm text-slate-500 italic">[PDF/File attached: {getFullUrl(documents.khatianCopyUrl)}]</p>
                    )}
                  </div>
                )}
                {documents?.kharijCopyUrl && (
                  <div className="mb-8">
                    <h3 className="font-bold text-slate-700 mb-2">Kharij Copy</h3>
                    {documents.kharijCopyUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={getFullUrl(documents.kharijCopyUrl)} alt="Kharij Copy" className="max-w-full h-auto border border-slate-200 rounded-lg max-h-[800px] object-contain" />
                    ) : (
                      <p className="text-sm text-slate-500 italic">[PDF/File attached: {getFullUrl(documents.kharijCopyUrl)}]</p>
                    )}
                  </div>
                )}
                {documents?.otherRecord && documents.otherRecord.map((record: any, index: number) => (
                  <div key={index} className="mb-8 break-inside-avoid">
                    <h3 className="font-bold text-slate-700 mb-2">{record.name || `Other Record ${index + 1}`}</h3>
                    {record.url?.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={getFullUrl(record.url)} alt={record.name || `Other Record ${index + 1}`} className="max-w-full h-auto border border-slate-200 rounded-lg max-h-[800px] object-contain" />
                    ) : (
                      <p className="text-sm text-slate-500 italic">[PDF/File attached: {getFullUrl(record.url)}]</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t-2 border-slate-100 text-center text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Generated by Land-Management System • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}
