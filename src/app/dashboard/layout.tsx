"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { useGetPromotionsQuery } from "@/redux/api/promotionsApiSlice";
import { Sparkles, X, Gift, CheckCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: promotionsResponse } = useGetPromotionsQuery();
  const promotions = promotionsResponse?.data || [];
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (promotions.length > 0) {
      const shown = sessionStorage.getItem("promotion_popup_shown");
      if (!shown) {
        setShowPromoModal(true);
      }
    }
  }, [promotions]);

  const handleClosePromoModal = () => {
    sessionStorage.setItem("promotion_popup_shown", "true");
    setShowPromoModal(false);
  };

  if (!token) return null; // Prevent rendering while redirecting

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <TopNavbar />

        {/* Dashboard children */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>

      {/* Promotion Modal */}
      {showPromoModal && promotions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
            onClick={handleClosePromoModal}
          />

          {/* Modal Container */}
          <div className="bg-white/95 backdrop-blur-xl border border-white/90 rounded-3xl shadow-2xl w-full max-w-lg p-6 relative hover:scale-[1.005] transition-transform duration-300 z-10 overflow-hidden group">
            {/* Top ambient color bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-500" />
            
            {/* Close Button */}
            <button
              onClick={handleClosePromoModal}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content layout */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50 shadow-md shrink-0">
                  <Gift className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-100/50 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                    Special Offer
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight mt-1">Exclusive Announcement</h3>
                </div>
              </div>

              {promotions[0].bannerUrl && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-100">
                  <img
                    src={promotions[0].bannerUrl}
                    alt={promotions[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {promotions[0].title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {promotions[0].description}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Promo Code</span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 font-mono text-sm font-black rounded-lg tracking-widest shadow-sm select-all">
                      {promotions[0].code}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Discount</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">
                    {promotions[0].discountPercentage}% OFF
                  </span>
                </div>
              </div>

              <button
                onClick={handleClosePromoModal}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4.5 h-4.5" />
                Acknowledge Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
