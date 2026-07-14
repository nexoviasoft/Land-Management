"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLanddocQuery, useApproveLanddocMutation } from "@/redux/api/landdocApiSlice";
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
  CheckCircle2
} from "lucide-react";

export default function LandDocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: responseData, error, isLoading } = useGetLanddocQuery(id, {
    skip: !id,
  });

  const role = useSelector((state: RootState) => state.auth.role);
  const [approveLanddoc, { isLoading: isApproving }] = useApproveLanddocMutation();

  const handleApprove = async () => {
    try {
      await approveLanddoc(id).unwrap();
      toast.success("Document approved successfully!");
    } catch (error) {
      toast.error("Failed to approve document.");
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
    <div className="w-full space-y-6 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/90 group relative overflow-hidden hover:border-brand-orange/25 transition-colors">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-brand-orange/10 to-amber-500/0 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="p-2.5 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white border border-slate-200/50 hover:border-slate-200 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center shrink-0"
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
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Registered: {formatDate(createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto relative z-10 flex-col sm:flex-row mt-4 md:mt-0">
          {role === "admin" && landdoc.status === "pending" && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 active:scale-95 disabled:opacity-70"
            >
              <CheckCircle2 className={`w-4 h-4 ${isApproving ? 'animate-pulse' : ''}`} />
              {isApproving ? "Approving..." : "Approve Document"}
            </button>
          )}
          
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
  );
}
