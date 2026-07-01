"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateLanddocMutation,
  useUploadLanddocFileMutation,
} from "@/redux/api/landdocApiSlice";
import { MOCK_MOUZAS } from "@/data/mouzaData";

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

  const [otherRecords, setOtherRecords] = useState<{ name: string; file: File | null }[]>([]);

  const [divisions, setDivisions] = useState<{ division: string }[]>([]);
  const [districts, setDistricts] = useState<{ district: string }[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-sm relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-full transition"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Land Document</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div>
            <h3 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4 text-slate-700">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Division *</label>
                <select required name="division" value={formData.location.division} onChange={handleLocationChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white text-slate-800">
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div.division} value={div.division}>{div.division}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">District *</label>
                <select required name="district" value={formData.location.district} onChange={handleLocationChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white text-slate-800" disabled={!formData.location.division}>
                  <option value="">Select District</option>
                  {districts.map((dist) => (
                    <option key={dist.district} value={dist.district}>{dist.district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Upazila *</label>
                <select required name="upazila" value={formData.location.upazila} onChange={handleLocationChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white text-slate-800" disabled={!formData.location.district}>
                  <option value="">Select Upazila</option>
                  {upazilas.map((upa) => (
                    <option key={upa} value={upa}>{upa}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mouza *</label>
                <input required type="text" name="mouza" list="mouza-options" value={formData.location.mouza} onChange={handleLocationChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800" />
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

          {/* Land Details Section */}
          <div>
            <h3 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4 text-slate-700">Land Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Khatian No *</label>
                <input required type="text" name="khatianNo" value={formData.landDetails.khatianNo} onChange={handleDetailsChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Dag No *</label>
                <input required type="text" name="dagNo" value={formData.landDetails.dagNo} onChange={handleDetailsChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kharij Case No *</label>
                <input required type="text" name="kharijCaseNo" value={formData.landDetails.kharijCaseNo} onChange={handleDetailsChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Land Type *</label>
                <input required type="text" name="landType" value={formData.landDetails.landType} onChange={handleDetailsChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4 text-slate-700">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Khatian Copy *</label>
                <input required type="file" accept="image/*,.pdf" onChange={(e) => setKhatianFile(e.target.files?.[0] || null)} className="w-full text-slate-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kharij Copy *</label>
                <input required type="file" accept="image/*,.pdf" onChange={(e) => setKharijFile(e.target.files?.[0] || null)} className="w-full text-slate-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
              </div>
            </div>
          </div>

          {/* Other Records */}
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-lg font-bold text-slate-700">Other Records (Optional)</h3>
              <button type="button" onClick={addOtherRecord} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                + Add Record
              </button>
            </div>
            
            {otherRecords.map((record, index) => (
              <div key={index} className="flex gap-4 items-end mb-4 bg-slate-50/50 border border-slate-150 p-4 rounded-2xl relative">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Document Name</label>
                  <input required type="text" value={record.name} onChange={(e) => updateOtherRecord(index, "name", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white/50 text-slate-800 text-sm" placeholder="e.g. Deed Copy" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">File</label>
                  <input required type="file" accept="image/*,.pdf" onChange={(e) => updateOtherRecord(index, "file", e.target.files?.[0] || null)} className="w-full text-slate-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition" />
                </div>
                <button type="button" onClick={() => removeOtherRecord(index)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl text-xs transition">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUploading} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-750 text-white font-semibold rounded-xl disabled:opacity-50 transition shadow-md shadow-emerald-500/10">
              {isCreating || isUploading ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
