import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              Who We Are
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              About LandSync
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are revolutionizing land registry, transaction validation, and owner records management through modern, secure technology.
            </p>
          </div>

          {/* Core Story */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 space-y-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">Our Story & Tech Stack</h2>
            <p className="text-slate-600 leading-relaxed">
              Founded with the vision to bring transparency and security to land ownership registry systems, LandSync integrates advanced distributed ledger concepts with Next.js 16 frameworks to provide real-time status tracking, conflict resolution, and seamless public search.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you are a buyer seeking verified property histories or an administrator managing registry approvals, LandSync bridges the gap with a user-friendly, responsive interface and cryptographically verifiable audit trails.
            </p>
          </div>

          {/* Cards for Team/Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors space-y-2 shadow-sm">
              <div className="text-2xl font-extrabold text-emerald-600">100%</div>
              <div className="text-sm font-semibold text-slate-800">Tamper-Proof Ledger</div>
              <p className="text-xs text-slate-500 font-medium">All registered land histories are encrypted and logged with immutable hashes.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors space-y-2 shadow-sm">
              <div className="text-2xl font-extrabold text-teal-600">0.5s</div>
              <div className="text-sm font-semibold text-slate-800">Verification Time</div>
              <p className="text-xs text-slate-500 font-medium">Query and find owner registry statuses within milliseconds.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors space-y-2 shadow-sm">
              <div className="text-2xl font-extrabold text-indigo-600">Secure</div>
              <div className="text-sm font-semibold text-slate-800">Role-Based Access</div>
              <p className="text-xs text-slate-500 font-medium">Granular permissions secure dashboards for citizens and administrators.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
