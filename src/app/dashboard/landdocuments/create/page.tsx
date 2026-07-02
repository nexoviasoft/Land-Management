"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateLanddocMutation,
  useUploadLanddocFileMutation,
} from "@/redux/api/landdocApiSlice";
import { MOCK_MOUZAS } from "@/data/mouzaData";
import Select from "react-select";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import {
  X,
  FilePlus,
  Compass,
  Layers,
  FileSpreadsheet,
  Grid,
  Hash,
  FileCheck,
  Upload,
  FolderHeart,
  Plus,
  Trash2,
  FileCheck2,
  Map,
  MapPin,
  Navigation,
  Locate,
  Tag,
} from "lucide-react";

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderColor: state.isFocused ? "#10b981" : "#e2e8f0",
    borderRadius: "0.75rem",
    padding: "3px 4px",
    paddingLeft: "30px",
    fontSize: "0.875rem",
    fontWeight: "500",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(16, 185, 129, 0.2)" : "none",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: state.isFocused ? "#10b981" : "#cbd5e1",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    border: "1px solid rgba(241, 245, 249, 0.8)",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
      ? "rgba(16, 185, 129, 0.08)"
      : "transparent",
    color: state.isSelected ? "#ffffff" : "#334155",
    fontSize: "0.875rem",
    fontWeight: "500",
    "&:active": {
      backgroundColor: "#10b981",
      color: "#ffffff",
    },
  }),
};

export default function CreateLandDocPage() {
  const router = useRouter();
  const [createLanddoc, { isLoading: isCreating }] = useCreateLanddocMutation();
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

  const [khatianFile, setKhatianFile] = useState<File | null>(null);
  const [kharijFile, setKharijFile] = useState<File | null>(null);
  const [khatianPreview, setKhatianPreview] = useState<string | null>(null);
  const [kharijPreview, setKharijPreview] = useState<string | null>(null);

  const [otherRecords, setOtherRecords] = useState<{ name: string; file: File | null; preview?: string | null }[]>([]);

  const [divisions, setDivisions] = useState<{ division: string }[]>([]);
  const [districts, setDistricts] = useState<{ district: string }[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  useEffect(() => {
    if (!khatianFile) {
      setKhatianPreview(null);
      return;
    }
    if (khatianFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(khatianFile);
      setKhatianPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setKhatianPreview(null);
    }
  }, [khatianFile]);

  useEffect(() => {
    if (!kharijFile) {
      setKharijPreview(null);
      return;
    }
    if (kharijFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(kharijFile);
      setKharijPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setKharijPreview(null);
    }
  }, [kharijFile]);

  useEffect(() => {
    return () => {
      otherRecords.forEach((rec) => {
        if (rec.preview) URL.revokeObjectURL(rec.preview);
      });
    };
  }, []);

  useEffect(() => {
    fetch("https://bdapis.com/api/v1.2/divisions")
      .then((res) => res.json())
      .then((data) => setDivisions(data.data || []))
      .catch((err) => console.error("Error fetching divisions:", err));
  }, []);

  useEffect(() => {
    if (formData.location.division) {
      fetch(`https://bdapis.com/api/v1.2/division/${formData.location.division.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.data || []))
        .catch((err) => console.error("Error fetching districts:", err));
    } else {
      setDistricts([]);
    }
  }, [formData.location.division]);

  useEffect(() => {
    if (formData.location.district) {
      fetch(`https://bdapis.com/api/v1.2/district/${formData.location.district.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => setUpazilas(data.data?.[0]?.upazillas || []))
        .catch((err) => console.error("Error fetching upazilas:", err));
    } else {
      setUpazilas([]);
    }
  }, [formData.location.district]);

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
    setOtherRecords([...otherRecords, { name: "", file: null, preview: null }]);
  };

  const updateOtherRecord = (index: number, field: string, value: any) => {
    const updated = [...otherRecords];
    if (field === "file" && value instanceof File) {
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview!);
      }
      const previewUrl = value.type.startsWith("image/") ? URL.createObjectURL(value) : null;
      updated[index] = { ...updated[index], file: value, preview: previewUrl };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setOtherRecords(updated);
  };

  const removeOtherRecord = (index: number) => {
    const target = otherRecords[index];
    if (target.preview) {
      URL.revokeObjectURL(target.preview);
    }
    setOtherRecords(otherRecords.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!khatianFile || !kharijFile) {
      alert("Please upload both Khatian and Kharij copies.");
      return;
    }

    try {
      // 1. Upload required files
      const khatianCopyUrl = await handleFileUpload(khatianFile);
      const kharijCopyUrl = await handleFileUpload(kharijFile);

      // 2. Upload other records
      const otherRecordUrls = [];
      for (const record of otherRecords) {
        if (record.name && record.file) {
          const url = await handleFileUpload(record.file);
          otherRecordUrls.push({ name: record.name, url });
        }
      }

      // 3. Submit payload
      const payload = {
        location: formData.location,
        landDetails: formData.landDetails,
        documents: {
          khatianCopyUrl,
          kharijCopyUrl,
          ...(otherRecordUrls.length > 0 && { otherRecord: otherRecordUrls }),
        },
      };

      await createLanddoc(payload).unwrap();
      alert("Land document created successfully!");
      router.push("/dashboard/landdocuments");
    } catch (error: any) {
      console.dir(error); // Using dir instead of error to see the full object in console
      const backendMessage = error?.data?.message;
      const errorMsg = Array.isArray(backendMessage) ? backendMessage.join("\\n") : backendMessage;
      alert(errorMsg || "Error creating land document.");
    }
  };

  return (
    <div className="w-full min-h-screen py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/8 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-teal-400/8 rounded-full blur-[110px] -z-10 pointer-events-none" />

      <div className="bg-white/45 backdrop-blur-xl border border-white/85 p-6 md:p-8 lg:p-10 rounded-3xl shadow-[0_12px_40px_-12px_rgba(148,163,184,0.12)] relative hover:border-emerald-500/20 transition-all duration-500">
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 rounded-full transition-all duration-300 shadow-sm border border-slate-200/40 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Page Title Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 bg-clip-text text-transparent tracking-tight">
              Add New Land Document
            </h2>
            <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">
              Submit location details, records, and required files for digital validation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Location Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Division *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Map className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <Select
                    options={divisions.map((div) => ({ value: div.division, label: div.division }))}
                    value={formData.location.division ? { value: formData.location.division, label: formData.location.division } : null}
                    onChange={(option: any) => setFormData({
                      ...formData,
                      location: { 
                        ...formData.location, 
                        division: option?.value || "",
                        district: "",
                        upazila: "",
                        mouza: ""
                      }
                    })}
                    placeholder="Select Division"
                    isClearable
                    required
                    styles={customSelectStyles}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">District *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <Select
                    options={districts.map((dist) => ({ value: dist.district, label: dist.district }))}
                    value={formData.location.district ? { value: formData.location.district, label: formData.location.district } : null}
                    onChange={(option: any) => setFormData({
                      ...formData,
                      location: { 
                        ...formData.location, 
                        district: option?.value || "",
                        upazila: "",
                        mouza: ""
                      }
                    })}
                    placeholder="Select District"
                    isDisabled={!formData.location.division}
                    isClearable
                    required
                    styles={customSelectStyles}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Upazila *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Navigation className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <Select
                    options={upazilas.map((upa) => ({ value: upa, label: upa }))}
                    value={formData.location.upazila ? { value: formData.location.upazila, label: formData.location.upazila } : null}
                    onChange={(option: any) => setFormData({
                      ...formData,
                      location: { 
                        ...formData.location, 
                        upazila: option?.value || "",
                        mouza: ""
                      }
                    })}
                    placeholder="Select Upazila"
                    isDisabled={!formData.location.district}
                    isClearable
                    required
                    styles={customSelectStyles}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mouza *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Locate className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="mouza" 
                    list="mouza-options" 
                    placeholder="Enter Mouza"
                    value={formData.location.mouza} 
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, mouza: e.target.value }
                    })}
                    className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white text-slate-800 text-sm font-medium" 
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
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Land Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Khatian No *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FileSpreadsheet className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="khatianNo"
                    value={formData.landDetails.khatianNo}
                    onChange={handleDetailsChange}
                    placeholder="Enter Khatian Number"
                    className="w-full pl-10.5 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Dag No *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Grid className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="dagNo"
                    value={formData.landDetails.dagNo}
                    onChange={handleDetailsChange}
                    placeholder="Enter Dag Number"
                    className="w-full pl-10.5 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Kharij Case No *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    name="kharijCaseNo"
                    value={formData.landDetails.kharijCaseNo}
                    onChange={handleDetailsChange}
                    placeholder="Enter Kharij Case Number"
                    className="w-full pl-10.5 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Land Type *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Tag className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <Select
                    options={[
                      { value: 'Agricultural', label: 'Agricultural (কৃষি)' },
                      { value: 'Residential', label: 'Residential (আবাসিক)' },
                      { value: 'Commercial', label: 'Commercial (বাণিজ্যিক)' },
                      { value: 'Industrial', label: 'Industrial (শিল্প)' },
                      { value: 'Fallow', label: 'Fallow (পতিত)' }
                    ]}
                    value={formData.landDetails.landType ? { value: formData.landDetails.landType, label: formData.landDetails.landType } : null}
                    onChange={(option: any) => setFormData({
                      ...formData,
                      landDetails: { ...formData.landDetails, landType: option?.value || "" }
                    })}
                    placeholder="Select Land Type"
                    isClearable
                    required
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Required Documents</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Khatian Copy *</label>
                <div className="border border-dashed border-slate-200 hover:border-emerald-500/50 bg-white/40 hover:bg-emerald-50/10 rounded-2xl p-6 transition-all duration-300 relative group flex flex-col items-center justify-center text-center min-h-[180px]">
                  {khatianPreview ? (
                    <div className="relative w-24 h-24 mb-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={khatianPreview} alt="Khatian Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-650 max-w-[220px] truncate">
                    {khatianFile ? khatianFile.name : "Select Khatian Copy file"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Image or PDF (Max 5MB)</span>
                  <input
                    required
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setKhatianFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Kharij Copy *</label>
                <div className="border border-dashed border-slate-200 hover:border-emerald-500/50 bg-white/40 hover:bg-emerald-50/10 rounded-2xl p-6 transition-all duration-300 relative group flex flex-col items-center justify-center text-center min-h-[180px]">
                  {kharijPreview ? (
                    <div className="relative w-24 h-24 mb-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={kharijPreview} alt="Kharij Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-650 max-w-[220px] truncate">
                    {kharijFile ? kharijFile.name : "Select Kharij Copy file"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Image or PDF (Max 5MB)</span>
                  <input
                    required
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
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FolderHeart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Other Records (Optional)</h3>
              </div>
              <button
                type="button"
                onClick={addOtherRecord}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-emerald-500/5 border border-emerald-200/50 flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
            </div>

            <div className="space-y-4">
              {otherRecords.map((record, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end bg-slate-50/40 border border-slate-200/60 p-5 rounded-2xl relative group/row hover:border-emerald-500/10 transition-all duration-300">
                  <div className="flex-grow space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</label>
                    <input
                      required
                      type="text"
                      value={record.name}
                      onChange={(e) => updateOtherRecord(index, "name", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm font-medium"
                      placeholder="e.g. Deed Copy"
                    />
                  </div>
                  <div className="flex-grow space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">File</label>
                    <div className="border border-dashed border-slate-200 hover:border-emerald-500/50 bg-white rounded-xl py-3.5 px-4 transition-all duration-300 relative flex items-center justify-center gap-2 cursor-pointer text-sm font-medium text-slate-600 min-h-[50px]">
                      {record.preview ? (
                        <div className="w-6 h-6 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={record.preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <Upload className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate max-w-[200px]">
                        {record.file ? record.file.name : "Choose File"}
                      </span>
                      <input
                        required
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => updateOtherRecord(index, "file", e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOtherRecord(index)}
                    className="px-4 py-3 bg-red-50 text-red-650 hover:bg-red-100/80 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 active:scale-95 shrink-0"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUploading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] flex items-center gap-2"
            >
              {isCreating || isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4.5 h-4.5" />
                  <span>Save Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
