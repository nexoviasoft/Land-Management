"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetLanddocQuery,
  useUpdateLanddocMutation,
  useUploadLanddocFileMutation,
} from "@/redux/api/landdocApiSlice";

interface EditLandDocProps {
  id: string;
}

export default function EditLandDoc({ id }: EditLandDocProps) {
  const router = useRouter();
  
  const { data: responseData, isLoading: isFetching, error } = useGetLanddocQuery(id, { skip: !id });
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

      await updateLanddoc({ id, data: payload }).unwrap();
      alert("Land document updated successfully!");
      router.push("/dashboard/landdocuments");
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || "Error updating land document.");
    }
  };

  if (isFetching) {
    return <div className="p-6 max-w-4xl mx-auto">Loading document details...</div>;
  }

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto text-red-500">Error loading document.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Land Document</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Location Section */}
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Division *</label>
              <input required type="text" name="division" value={formData.location.division} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District *</label>
              <input required type="text" name="district" value={formData.location.district} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upazila *</label>
              <input required type="text" name="upazila" value={formData.location.upazila} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mouza *</label>
              <input required type="text" name="mouza" value={formData.location.mouza} onChange={handleLocationChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
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
              <label className="block text-sm font-medium text-gray-700">Khatian Copy</label>
              {documentsState.khatianCopyUrl && !khatianFile && (
                <div className="text-xs text-blue-600 mb-2 truncate">
                  Current: <a href={documentsState.khatianCopyUrl.startsWith("http") ? documentsState.khatianCopyUrl : `http://localhost:8000${documentsState.khatianCopyUrl}`} target="_blank" rel="noreferrer" className="underline">View File</a>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setKhatianFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
              <p className="text-xs text-gray-400 mt-1">Upload a new file to replace the existing one.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kharij Copy</label>
              {documentsState.kharijCopyUrl && !kharijFile && (
                <div className="text-xs text-blue-600 mb-2 truncate">
                  Current: <a href={documentsState.kharijCopyUrl.startsWith("http") ? documentsState.kharijCopyUrl : `http://localhost:8000${documentsState.kharijCopyUrl}`} target="_blank" rel="noreferrer" className="underline">View File</a>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setKharijFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
              <p className="text-xs text-gray-400 mt-1">Upload a new file to replace the existing one.</p>
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
            <div key={index} className="flex flex-col gap-4 mb-6 bg-gray-50 p-4 rounded-md relative border border-gray-200">
              <button type="button" onClick={() => removeOtherRecord(index)} className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs">
                Remove
              </button>
              <div className="flex gap-4 items-start w-full pr-16">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700">Document Name</label>
                  <input required type="text" value={record.name} onChange={(e) => updateOtherRecord(index, "name", e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="e.g. Deed Copy" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700">File</label>
                  {record.url && !record.file && (
                    <div className="text-xs text-blue-600 mb-1 truncate">
                      Current: <a href={record.url.startsWith("http") ? record.url : `http://localhost:8000${record.url}`} target="_blank" rel="noreferrer" className="underline">View File</a>
                    </div>
                  )}
                  <input type={record.url ? "file" : "file"} required={!record.url} accept="image/*,.pdf" onChange={(e) => updateOtherRecord(index, "file", e.target.files?.[0] || null)} className="mt-1 block w-full text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isUpdating || isUploading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition">
            {isUpdating || isUploading ? "Saving Changes..." : "Update Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
