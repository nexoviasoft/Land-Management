"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from "@/redux/api/promotionsApiSlice";
import { uploadImageToImgBB } from "@/utils/uploadImage";
import {
  Sparkles,
  Gift,
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  Tag,
  Calendar,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  discountPercentage: number;
  bannerUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  promoTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  promoTitle: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-sm shadow-xl mx-4 relative hover:scale-[1.01] transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">Delete Promotion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{promoTitle}</span>? This action is permanent.
            </p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-500/10 active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upsert Promotion Modal Component (combined create & edit)
function PromoUpsertModal({
  isOpen,
  onClose,
  promotion,
}: {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion | null;
}) {
  const [createPromo, { isLoading: isCreating }] = useCreatePromotionMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdatePromotionMutation();

  const [title, setTitle] = useState(promotion?.title || "");
  const [description, setDescription] = useState(promotion?.description || "");
  const [code, setCode] = useState(promotion?.code || "");
  const [discountPercentage, setDiscountPercentage] = useState(promotion?.discountPercentage?.toString() || "10");
  const [bannerUrl, setBannerUrl] = useState(promotion?.bannerUrl || "");
  const [startDate, setStartDate] = useState(
    promotion?.startDate ? new Date(promotion.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    promotion?.endDate ? new Date(promotion.endDate).toISOString().split("T")[0] : ""
  );
  const [isActive, setIsActive] = useState(promotion ? promotion.isActive : true);
  
  const [uploadingImage, setUploadingImage] = useState(false);

  React.useEffect(() => {
    if (promotion) {
      setTitle(promotion.title);
      setDescription(promotion.description);
      setCode(promotion.code);
      setDiscountPercentage(promotion.discountPercentage.toString());
      setBannerUrl(promotion.bannerUrl || "");
      setStartDate(promotion.startDate ? new Date(promotion.startDate).toISOString().split("T")[0] : "");
      setEndDate(promotion.endDate ? new Date(promotion.endDate).toISOString().split("T")[0] : "");
      setIsActive(promotion.isActive);
    } else {
      setTitle("");
      setDescription("");
      setCode("");
      setDiscountPercentage("10");
      setBannerUrl("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
    }
  }, [promotion, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Uploading banner image...");
    try {
      const url = await uploadImageToImgBB(file);
      setBannerUrl(url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code || !discountPercentage) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title,
      description,
      code: code.toUpperCase().trim(),
      discountPercentage: parseFloat(discountPercentage),
      bannerUrl: bannerUrl || null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      isActive,
    };

    const actionToast = toast.loading(promotion ? "Updating promotion..." : "Creating promotion...");
    try {
      if (promotion) {
        await updatePromo({ id: promotion.id, data: payload }).unwrap();
        toast.success("Promotion updated successfully", { id: actionToast });
      } else {
        await createPromo(payload).unwrap();
        toast.success("Promotion created successfully", { id: actionToast });
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save promotion", { id: actionToast });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-lg shadow-xl mx-4 relative hover:scale-[1.005] transition-transform duration-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {promotion ? "Edit Promotion" : "Create New Promotion"}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              {promotion ? "Modify active marketing asset" : "Announce new deals & offers"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Year Special Discount"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or terms of the promotion..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Promo Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. LAND20"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Discount Percentage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Banner Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center shrink-0">
                {bannerUrl ? (
                  <Image src={bannerUrl} alt="Preview" layout="fill" objectFit="cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="promo-banner-file"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="promo-banner-file"
                  className="inline-flex items-center px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition active:scale-95"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Uploading...
                    </>
                  ) : (
                    "Choose Image File"
                  )}
                </label>
                <p className="text-[10px] text-slate-400">Directly uploaded to ImgBB and saved.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is-active-checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-slate-350 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is-active-checkbox" className="text-xs font-bold text-slate-650 uppercase tracking-wider">
              Mark this promotion as Active
            </label>
          </div>

          <div className="flex w-full gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating || uploadingImage}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              {(isCreating || isUpdating) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {promotion ? "Save Changes" : "Publish Promotion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PromotionsManagementPage() {
  const router = useRouter();
  const [upsertPromo, setUpsertPromo] = useState<Promotion | null>(null);
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  const { data: promotionsResponse, isLoading, error } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();

  const promotions: Promotion[] = promotionsResponse?.data || [];

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePromotion(deleteTarget.id).unwrap();
      toast.success("Promotion deleted successfully");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete promotion");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading promotions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Error loading promotions</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 py-4 sm:py-6 relative overflow-x-hidden">
      {/* Background Radial Glow elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-teal-400/5 rounded-full blur-[110px] -z-10 pointer-events-none" />

      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/90 p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.04)] transition-all duration-500 group">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/0 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-teal-500/5 to-emerald-500/0 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 bg-clip-text text-transparent tracking-tight">
            Promotions Management
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Create, update, and manage marketing banners and promotional discounts
          </p>
        </div>
        <button
          onClick={() => {
            setUpsertPromo(null);
            setIsUpsertOpen(true);
          }}
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Promotion
        </button>
      </div>

      {/* Main Promotions list */}
      <div className="bg-white/45 backdrop-blur-xl rounded-3xl border border-white/85 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.08)] overflow-hidden">
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200/40">
                <th className="py-4.5 px-6">Banner & Title</th>
                <th className="py-4.5 px-6">Promo Code</th>
                <th className="py-4.5 px-6">Discount</th>
                <th className="py-4.5 px-6">Validity Period</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 text-sm divide-y divide-slate-100/50">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold">
                    No promotions found. Click "Add Promotion" to publish one.
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-white/30 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-4 min-w-[280px]">
                      <div className="w-16 h-10 rounded-lg overflow-hidden relative border border-slate-200 shadow-sm bg-slate-50 shrink-0">
                        {promo.bannerUrl ? (
                          <Image
                            src={promo.bannerUrl}
                            alt={promo.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-[200px]" title={promo.title}>
                        {promo.title}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-850 font-mono text-xs font-bold rounded-lg tracking-wider">
                        {promo.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-600 text-sm">
                      {promo.discountPercentage}% OFF
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : "Always"}
                          {" — "}
                          {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : "Always"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        promo.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-55 bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {promo.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setUpsertPromo(promo);
                            setIsUpsertOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50/40 text-emerald-800 border border-emerald-200/50 hover:bg-emerald-100/70 transition shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(promo)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center gap-1 active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-650" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards view */}
        <div className="block md:hidden p-4 space-y-4">
          {promotions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-semibold bg-white/20 rounded-2xl">
              No promotions found.
            </div>
          ) : (
            promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white/50 backdrop-blur-md border border-white/60 p-4 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden relative border border-slate-200 shadow-sm bg-slate-50 shrink-0">
                    {promo.bannerUrl ? (
                      <Image src={promo.bannerUrl} alt={promo.title} layout="fill" objectFit="cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{promo.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[9px] font-bold rounded">
                        {promo.code}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        promo.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {promo.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-slate-200/30 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-405 text-slate-400 font-bold block uppercase">Discount</span>
                    <span className="font-bold text-emerald-600">{promo.discountPercentage}% OFF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Valid Until</span>
                    <span className="font-semibold text-slate-650">
                      {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : "Always"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/30">
                  <button
                    onClick={() => {
                      setUpsertPromo(promo);
                      setIsUpsertOpen(true);
                    }}
                    className="py-2 text-xs font-bold rounded-xl bg-emerald-50/40 text-emerald-800 border border-emerald-200/50 hover:bg-emerald-100/70 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(promo)}
                    className="py-2 text-xs font-bold rounded-xl bg-red-50 text-red-650 border border-red-200 hover:bg-red-100/80 transition shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Upsert Modal */}
      <PromoUpsertModal
        isOpen={isUpsertOpen}
        onClose={() => setIsUpsertOpen(false)}
        promotion={upsertPromo}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        promoTitle={deleteTarget?.title || ""}
      />
    </div>
  );
}
