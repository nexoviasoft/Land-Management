"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetLanddocQuery,
  useUpdateLanddocMutation,
  useUploadLanddocFileMutation,
} from "@/redux/api/landdocApiSlice";
import { MOCK_MOUZAS } from "@/data/mouzaData";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import {
  Map,
  MapPin,
  Navigation,
  Locate,
  Layers,
  Grid,
  FileSpreadsheet,
  Tag,
  Upload,
  Trash2,
  X,
  Plus,
  ArrowLeft,
  FileText,
  AlertTriangle,
  FolderOpen
} from "lucide-react";

export default function EditLandDocPage() {
  const router = useRouter();
  const params = useParams();
  
  const actualId = params.id as string;

  const { data: responseData, isLoading: isFetching, error } = useGetLanddocQuery(actualId, { skip: !actualId });
  const [updateLanddoc, { isLoading: isUpdating }] = useUpdateLanddocMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadLanddocFileMutation();

  const [formData, setFormData] = useState({
    location: {
      division: "",
      district: "",
      upazila: "",
      mouza: "",
    },
    landDetails: {
      khatianNo: "",
      dagNo: "",
      kharijCaseNo: "",
      landType: "",
    },
  });

  const [documentsState, setDocumentsState] = useState<{
    khatianCopyUrl: string;
    kharijCopyUrl: string;
  }>({ khatianCopyUrl: "", kharijCopyUrl: "" });

  const [khatianFile, setKhatianFile] = useState<File | null>(null);
  const [kharijFile, setKharijFile] = useState<File | null>(null);
  const [otherRecords, setOtherRecords] = useState<{ name: string; url?: string; file: File | null }[]>([]);

  useEffect(() => {
    if (responseData?.data) {
      const { location, landDetails, documents } = responseData.data;
      setFormData({
        location: {
          division: location?.division || "",
          district: location?.district || "",
          upazila: location?.upazila || "",
          mouza: location?.mouza || "",
        },
        landDetails: {
          khatianNo: landDetails?.khatianNo || "",
          dagNo: landDetails?.dagNo || "",
          kharijCaseNo: landDetails?.kharijCaseNo || "",
          landType: landDetails?.landType || "",
        },
      });
      setDocumentsState({
        khatianCopyUrl: documents?.khatianCopyUrl || "",
        kharijCopyUrl: documents?.kharijCopyUrl || "",
      });
      if (documents?.otherRecord) {
        setOtherRecords(
          documents.otherRecord.map((record: any) => ({
            name: record.name,
            url: record.url,
            file: null,
          }))
        );
      }
    }
  }, [responseData]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      location: { ...formData.location, [e.target.name]: e.target.value },
    });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      landDetails: { ...formData.landDetails, [e.target.name]: e.target.value },
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith("image/")) {
      return await uploadImageToImgBB(file);
    }
    const data = new FormData();
    data.append("file", file);
    const res = await uploadFile(data).unwrap();
    return res?.data?.url || res?.url;
  };

  const addOtherRecord = () => {
    setOtherRecords([...otherRecords, { name: "", file: null }]);
  };

  const updateOtherRecord = (index: number, field: string, value: any) => {
    const updated = [...otherRecords];
    updated[index] = { ...updated[index], [field]: value };
    setOtherRecords(updated);
  };

  const removeOtherRecord = (index: number) => {
    setOtherRecords(otherRecords.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload new files if selected, otherwise keep existing URLs
      const finalKhatianUrl = khatianFile ? await handleFileUpload(khatianFile) : documentsState.khatianCopyUrl;
      const finalKharijUrl = kharijFile ? await handleFileUpload(kharijFile) : documentsState.kharijCopyUrl;

      // Handle other records
      const finalOtherRecords = [];
      for (const record of otherRecords) {
        if (record.file) {
          const uploadedUrl = await handleFileUpload(record.file);
          finalOtherRecords.push({ name: record.name, url: uploadedUrl });
        } else if (record.url) {
          finalOtherRecords.push({ name: record.name, url: record.url });
        }
      }

      // Submit payload
      const payload = {
        location: formData.location,
        landDetails: formData.landDetails,
        documents: {
          khatianCopyUrl: finalKhatianUrl,
          kharijCopyUrl: finalKharijUrl,
          ...(finalOtherRecords.length > 0 && { otherRecord: finalOtherRecords }),
        },
      };

      await updateLanddoc({ id: actualId, data: payload }).unwrap();
      router.push("/dashboard/landdocuments");
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || "Error updating land document.");
    }
  };

  if (!actualId) return null;

  if (isFetching) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading document details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading document</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Failed to load document details for editing.
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

  return (
    <div className="w-full space-y-6 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Main Glass Form Card */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 md:p-8 rounded-3xl shadow-[0_12px_40px_-12px_rgba(148,163,184,0.08)] relative overflow-hidden group">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200/50 transition active:scale-95 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Edit Land Document</h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Update registered records
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <MapPin className="w-4.5 h-4.5 text-brand-orange" />
              Location Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Division *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Map className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="division" 
                    value={formData.location.division} 
                    onChange={handleLocationChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">District *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="district" 
                    value={formData.location.district} 
                    onChange={handleLocationChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Upazila *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Navigation className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="upazila" 
                    value={formData.location.upazila} 
                    onChange={handleLocationChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mouza *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Locate className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="mouza" 
                    list="mouza-options" 
                    value={formData.location.mouza} 
                    onChange={handleLocationChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                  <datalist id="mouza-options">
                    {(formData.location.upazila === "Mithapukur" || formData.location.upazila === "মিঠাপুকুর") 
                      && MOCK_MOUZAS.map((mouza) => (
                          <option key={mouza.MOUZA_NAME} value={mouza.MOUZA_NAME} />
                        ))
                    }
                  </datalist>
                </div>
              </div>

            </div>
          </div>

          {/* Land Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <Tag className="w-4.5 h-4.5 text-brand-orange" />
              Land Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Khatian No *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Layers className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="khatianNo" 
                    value={formData.landDetails.khatianNo} 
                    onChange={handleDetailsChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Dag No *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Grid className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="dagNo" 
                    value={formData.landDetails.dagNo} 
                    onChange={handleDetailsChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Kharij Case No *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FileSpreadsheet className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="kharijCaseNo" 
                    value={formData.landDetails.kharijCaseNo} 
                    onChange={handleDetailsChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Land Type *</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Tag className="h-4.5 w-4.5 text-slate-400 group-focus-within/input:text-brand-orange transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="landType" 
                    value={formData.landDetails.landType} 
                    onChange={handleDetailsChange} 
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-slate-100">
              <FileText className="w-4.5 h-4.5 text-brand-orange" />
              Required Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Khatian Copy dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Khatian Copy</label>
                {documentsState.khatianCopyUrl && !khatianFile && (
                  <div className="text-[10px] text-brand-orange bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl mb-2.5 inline-block truncate max-w-full font-bold uppercase tracking-wider">
                    Current: <a href={documentsState.khatianCopyUrl.startsWith("http") ? documentsState.khatianCopyUrl : `https://land-management-api.vercel.app${documentsState.khatianCopyUrl}`} target="_blank" rel="noreferrer" className="underline hover:text-brand-orange-hover">View File</a>
                  </div>
                )}
                
                <div className="border border-dashed border-slate-200 hover:border-brand-orange/50 bg-white/40 hover:bg-orange-50/10 rounded-2xl p-4 transition-all duration-300 relative group/drop flex items-center gap-3 cursor-pointer min-h-[80px]">
                  <Upload className="w-6 h-6 text-slate-400 group-hover/drop:text-brand-orange transition-colors shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-600 max-w-[200px] truncate">
                      {khatianFile ? khatianFile.name : "Choose Khatian file"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PDF or Image (Max 2MB)</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => setKhatianFile(e.target.files?.[0] || null)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              {/* Kharij Copy dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Kharij Copy</label>
                {documentsState.kharijCopyUrl && !kharijFile && (
                  <div className="text-[10px] text-brand-orange bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl mb-2.5 inline-block truncate max-w-full font-bold uppercase tracking-wider">
                    Current: <a href={documentsState.kharijCopyUrl.startsWith("http") ? documentsState.kharijCopyUrl : `https://land-management-api.vercel.app${documentsState.kharijCopyUrl}`} target="_blank" rel="noreferrer" className="underline hover:text-brand-orange-hover">View File</a>
                  </div>
                )}
                
                <div className="border border-dashed border-slate-200 hover:border-brand-orange/50 bg-white/40 hover:bg-orange-50/10 rounded-2xl p-4 transition-all duration-300 relative group/drop flex items-center gap-3 cursor-pointer min-h-[80px]">
                  <Upload className="w-6 h-6 text-slate-400 group-hover/drop:text-brand-orange transition-colors shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-600 max-w-[200px] truncate">
                      {kharijFile ? kharijFile.name : "Choose Kharij file"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PDF or Image (Max 2MB)</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => setKharijFile(e.target.files?.[0] || null)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Other Records */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <FolderOpen className="w-4.5 h-4.5 text-brand-orange" />
                Other Records (Optional)
              </h3>
              <button 
                type="button" 
                onClick={addOtherRecord} 
                className="px-3 py-1.5 text-xs font-bold bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white border border-orange-100/55 hover:border-brand-orange rounded-xl transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Record
              </button>
            </div>
            
            {otherRecords.map((record, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-4 bg-white/40 border border-slate-200/80 p-4.5 rounded-2xl relative group/item hover:border-brand-orange/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <button 
                  type="button" 
                  onClick={() => removeOtherRecord(index)} 
                  className="absolute top-3 right-3 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100/80 hover:bg-red-600 hover:text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-sm"
                >
                  Remove
                </button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-16 w-full">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</label>
                    <input 
                      required 
                      type="text" 
                      value={record.name} 
                      onChange={(e) => updateOtherRecord(index, "name", e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-white text-slate-800 text-sm font-medium" 
                      placeholder="e.g. Deed Copy" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">File</label>
                    {record.url && !record.file && (
                      <div className="text-[10px] text-brand-orange bg-orange-50 border border-orange-100 px-3 py-1 rounded-xl mb-1.5 inline-block truncate max-w-full font-bold uppercase tracking-wider">
                        Current: <a href={record.url.startsWith("http") ? record.url : `https://land-management-api.vercel.app${record.url}`} target="_blank" rel="noreferrer" className="underline hover:text-brand-orange-hover">View File</a>
                      </div>
                    )}
                    
                    <div className="border border-dashed border-slate-200 hover:border-brand-orange/50 bg-white/40 hover:bg-orange-50/10 rounded-xl p-3.5 transition-all duration-300 relative group/filedrop flex items-center gap-2 cursor-pointer">
                      <Upload className="w-4.5 h-4.5 text-slate-400 group-hover/filedrop:text-brand-orange transition-colors shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                          {record.file ? record.file.name : "Choose file"}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        required={!record.url} 
                        accept="image/*,.pdf" 
                        onChange={(e) => updateOtherRecord(index, "file", e.target.files?.[0] || null)} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200/40 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating || isUploading} 
              className="px-6 py-2.5 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange-hover hover:to-orange-400 text-white font-bold rounded-xl text-xs transition shadow-md shadow-brand-orange/10 hover:shadow-brand-orange/25 disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
            >
              {isUpdating || isUploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Document</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
