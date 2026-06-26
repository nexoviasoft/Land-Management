"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const handleSearch = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: "CS-2931", area: "5.5 Katha" });
      }, 1500);
    });

    toast.promise(promise, {
      loading: "Querying secure blockchain land registry...",
      success: (data: any) => {
        return `Khatian ${data.code} Verified! Registered Area: ${data.area}.`;
      },
      error: "Failed to connect to ILMIS node.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-grow w-full relative">
        {/* Glow backdrop */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
              Government of Bangladesh • ILMIS
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
              E-Registry Land Records & Mutation Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Verify smart ownership deeds (Khatian), pay land development tax online, track mutation petitions, and inspect Mauza maps on our decentralized ledger system.
            </p>
          </div>

          {/* Land Registry Search Widget */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Search Land Records Ledger
            </h3>
            
            <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Division</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors">
                  <option>Dhaka</option>
                  <option>Rajshahi</option>
                  <option>Chittagong</option>
                  <option>Sylhet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors">
                  <option>Dhaka</option>
                  <option>Manikganj</option>
                  <option>Gazipur</option>
                  <option>Sylhet Sadar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search By</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors">
                  <option>Khatian No (খতিয়ান)</option>
                  <option>Dag No (দাগ নম্বর)</option>
                  <option>Owner Name (মালিকের নাম)</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Records
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Real-time statistics section */}
        <section className="bg-slate-100/60 border-y border-slate-200 py-12">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-slate-800">4.8M+</p>
              <p className="text-xs text-slate-500 font-medium">Digitized Khatians</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600">99.8%</p>
              <p className="text-xs text-slate-500 font-medium">Registry Match Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-slate-800">12.5k</p>
              <p className="text-xs text-slate-500 font-medium">Mauzas Indexed</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-teal-600">180k+</p>
              <p className="text-xs text-slate-500 font-medium">Completed Mutations</p>
            </div>
          </div>
        </section>

        {/* Core Land Services Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Key Citizen Services</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Get immediate access to core digital services without visiting tehsil offices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base">E-Mutation (নামজারি)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Submit mutation applications with digitized sale deeds. Track queue progress, resolve desk officer queries, and print generated mutation certificates online.
                </p>
              </div>
              <Link href="/dashboard/user" className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1 mt-4">
                Start Petition
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base">LD Tax (ভূমি উন্নয়ন কর)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculate yearly land development taxes using your Khatian area data. Pay securely via mobile financial services (MFS) or cards and download instantly generated tax clearance certificates (Dakhila).
                </p>
              </div>
              <Link href="/dashboard/user" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1 mt-4">
                Calculate & Pay Tax
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-slate-350 hover:shadow-sm transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-base">Mauza Maps (মৌজা ম্যাপ)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Search, review, and request certified physical prints of registered Mauza maps and satellite property boundaries. Check overlapping parcel coordinates in high resolution.
                </p>
              </div>
              <Link href="/gallery" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 mt-4">
                Explore Gallery
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
