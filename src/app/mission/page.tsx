import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="space-y-12">
          {/* Page Title */}
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              Our Vision
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Mission & Core Principles
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              We strive to empower citizens and eliminate land registry bureaucracy through decentralized integrity.
            </p>
          </div>

          {/* Detailed Statement */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
            <div className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold text-slate-800">Redefining Land Management for the 21st Century</h2>
              <p className="text-slate-600 leading-relaxed">
                Land ownership is the cornerstone of economic security, agricultural production, and individual prosperity. Yet, legacy systems are plagued by database desynchronizations, missing deeds, and slow validation cycles.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our mission is to establish a unified, secure digital record system that eliminates fraudulent registry attempts, minimizes physical bureaucracy, and delivers immediate property status reports to citizens and legal institutions alike.
              </p>
            </div>
          </div>

          {/* Pillars of Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Immutable Integrity</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every transaction log, transfer of title, and spatial modification is hash-chained to prevent backend data manipulation.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-650">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Universal Accessibility</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Simple tools designed for citizens of all digital literacy levels, including mobile-optimized tracking apps and hotlines.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Efficient Processing</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Shorten registry approvals from months to minutes by routing documents directly to relevant desk officers.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Conflict Resolution</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Clear guidelines and automated legal-flagging features help identify overlapping parcel claims immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
