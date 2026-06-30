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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Land Document</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Division *</label>
                <select required name="division" value={formData.location.division} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                  <option value="">Select Division</option>
                  {divisions.map((div) => (
                    <option key={div.division} value={div.division}>{div.division}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District *</label>
                <select required name="district" value={formData.location.district} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" disabled={!formData.location.division}>
                  <option value="">Select District</option>
                  {districts.map((dist) => (
                    <option key={dist.district} value={dist.district}>{dist.district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upazila *</label>
                <select required name="upazila" value={formData.location.upazila} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" disabled={!formData.location.district}>
                  <option value="">Select Upazila</option>
                  {upazilas.map((upa) => (
                    <option key={upa} value={upa}>{upa}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mouza *</label>
                <input required type="text" name="mouza" list="mouza-options" value={formData.location.mouza} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
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
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Land Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Khatian No *</label>
                <input required type="text" name="khatianNo" value={formData.landDetails.khatianNo} onChange={handleDetailsChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dag No *</label>
                <input required type="text" name="dagNo" value={formData.landDetails.dagNo} onChange={handleDetailsChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kharij Case No *</label>
                <input required type="text" name="kharijCaseNo" value={formData.landDetails.kharijCaseNo} onChange={handleDetailsChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Land Type *</label>
                <input required type="text" name="landType" value={formData.landDetails.landType} onChange={handleDetailsChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Khatian Copy *</label>
                <input required type="file" accept="image/*,.pdf" onChange={(e) => setKhatianFile(e.target.files?.[0] || null)} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kharij Copy *</label>
                <input required type="file" accept="image/*,.pdf" onChange={(e) => setKharijFile(e.target.files?.[0] || null)} className="mt-1 block w-full" />
              </div>
            </div>
          </div>

          {/* Other Records */}
          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Other Records (Optional)</h3>
              <button type="button" onClick={addOtherRecord} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
                + Add Record
              </button>
            </div>
            
            {otherRecords.map((record, index) => (
              <div key={index} className="flex gap-4 items-end mb-4 bg-gray-50 p-4 rounded-md">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700">Document Name</label>
                  <input required type="text" value={record.name} onChange={(e) => updateOtherRecord(index, "name", e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="e.g. Deed Copy" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700">File</label>
                  <input required type="file" accept="image/*,.pdf" onChange={(e) => updateOtherRecord(index, "file", e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
                </div>
                <button type="button" onClick={() => removeOtherRecord(index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUploading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isCreating || isUploading ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
