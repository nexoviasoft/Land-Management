"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLanddocQuery } from "@/redux/api/landdocApiSlice";

export default function LandDocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: responseData, error, isLoading } = useGetLanddocQuery(id, {
    skip: !id,
  });

  const landdoc = responseData?.data;

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded"></div>
            <div className="h-48 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !landdoc) {
    return (
      <div className="p-6 text-red-500 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <svg
          className="w-16 h-16 mb-4 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold">Error loading document</h2>
        <p className="mt-2 text-gray-600">The requested land document could not be found or there was an API error.</p>
        <button onClick={() => router.back()} className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          Go Back
        </button>
      </div>
    );
  }

  const { location, landDetails, documents, createdAt } = landdoc;

  const getFullUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:8000${url}`;
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
          filesToDownload.push({ title: (record.name || `Other_Record_${index + 1}`).replace(/\s+/g, '_'), url: getFullUrl(record.url) });
        }
      });
    }

    if (filesToDownload.length === 0) {
      alert("No files available to download.");
      return;
    }

    // Function to fetch a file as a blob and download it
    for (const file of filesToDownload) {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        
        // Extract extension from url or mime type
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
        
        // Small delay to allow the browser to process consecutive downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Failed to download file:", file.url, error);
      }
    }
  };

  const DocumentCard = ({ title, url }: { title: string; url: string }) => {
    if (!url) return null;
    const fullUrl = getFullUrl(url);
    const isImage = fullUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;

    const handleSingleDownload = async (e: React.MouseEvent) => {
      e.preventDefault();
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
      } catch (error) {
        console.error("Failed to download file:", fullUrl, error);
        alert("Failed to download the file. Please try viewing it instead.");
      }
    };

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h4 className="font-semibold text-gray-700 truncate max-w-full sm:max-w-[50%]">{title}</h4>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleSingleDownload}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors w-full sm:w-auto justify-center"
            >
              <span>View</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative group">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fullUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Document PDF/File</span>
            </div>
          )}
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Land Document
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                {landDetails?.landType || "Unknown Type"}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Registered on {new Date(createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All Files
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Location Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location Info
            </h3>
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Division</p>
                <p className="text-base font-semibold text-gray-900">{location?.division}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">District</p>
                <p className="text-base font-semibold text-gray-900">{location?.district}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Upazila</p>
                <p className="text-base font-semibold text-gray-900">{location?.upazila}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mouza</p>
                <p className="text-base font-semibold text-gray-900">{location?.mouza}</p>
              </div>
            </div>
          </div>

          {/* Land Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Land Identifiers
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <p className="text-sm font-medium text-gray-500">Khatian No.</p>
                <p className="text-base font-bold text-gray-900">{landDetails?.khatianNo}</p>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <p className="text-sm font-medium text-gray-500">Dag No.</p>
                <p className="text-base font-bold text-gray-900">{landDetails?.dagNo}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">Kharij Case No.</p>
                <p className="text-base font-bold text-gray-900">{landDetails?.kharijCaseNo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Documents Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Document Gallery
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {documents?.khatianCopyUrl && (
                <DocumentCard title="Khatian Copy" url={documents.khatianCopyUrl} />
              )}
              {documents?.kharijCopyUrl && (
                <DocumentCard title="Kharij Copy" url={documents.kharijCopyUrl} />
              )}
              
              {/* Other Records */}
              {documents?.otherRecord && documents.otherRecord.map((record: any, index: number) => (
                <DocumentCard key={index} title={record.name || `Other Record ${index + 1}`} url={record.url} />
              ))}
            </div>

            {!documents?.khatianCopyUrl && !documents?.kharijCopyUrl && (!documents?.otherRecord || documents?.otherRecord?.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No documents attached to this record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
