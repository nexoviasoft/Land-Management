"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, ArrowRight, FileText, Coins, Map, ShieldCheck, Bell,
  BarChart3, QrCode, Smartphone, Globe, CheckCircle2,
  Upload, Database, ScrollText, Landmark, FileCheck, Receipt, Pen, ChevronRight
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Division = "Dhaka" | "Rajshahi" | "Chittagong" | "Sylhet" | "Khulna" | "Barishal" | "Mymensingh" | "Rangpur";
type SearchType = "khatian" | "dag" | "owner" | "mouza";

const DISTRICTS: Record<Division, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Manikganj", "Narayanganj", "Narsingdi", "Munshiganj", "Tangail"],
  Rajshahi: ["Rajshahi", "Chapai Nawabganj", "Natore", "Naogaon", "Pabna", "Sirajganj", "Bogura"],
  Chittagong: ["Chattogram", "Cox's Bazar", "Comilla", "Brahmanbaria", "Feni", "Noakhali", "Lakshmipur"],
  Sylhet: ["Sylhet", "Moulvibazar", "Sunamganj", "Habiganj"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail", "Magura"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Barguna", "Jhalokati"],
  Mymensingh: ["Mymensingh", "Netrokona", "Kishoreganj", "Jamalpur", "Sherpur"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Lalmonirhat", "Nilphamari", "Thakurgaon"],
};

// ─── SVG Illustrations ────────────────────────────────────────────────────────
function LandIllustration() {
  return (
    <svg viewBox="0 0 480 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="480" height="320" fill="url(#sky)" rx="16" />
      <circle cx="400" cy="60" r="36" fill="#fde68a" opacity="0.8" />
      <circle cx="400" cy="60" r="28" fill="#fbbf24" />
      <ellipse cx="100" cy="70" rx="40" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="130" cy="62" rx="30" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="80" cy="65" rx="28" ry="16" fill="white" opacity="0.9" />
      <ellipse cx="280" cy="50" rx="35" ry="15" fill="white" opacity="0.8" />
      <ellipse cx="305" cy="43" rx="25" ry="17" fill="white" opacity="0.8" />
      <rect x="0" y="220" width="480" height="100" fill="#4ade80" opacity="0.5" />
      <rect x="30" y="180" width="120" height="60" fill="#4ade80" opacity="0.6" stroke="#16a34a" strokeWidth="2" />
      <rect x="160" y="185" width="140" height="55" fill="#86efac" opacity="0.7" stroke="#16a34a" strokeWidth="2" />
      <rect x="310" y="175" width="130" height="65" fill="#4ade80" opacity="0.5" stroke="#16a34a" strokeWidth="2" />
      <text x="90" y="214" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="bold">Dag: 1024</text>
      <text x="230" y="216" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="bold">Dag: 2087</text>
      <text x="375" y="211" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="bold">Dag: 3312</text>
      <path d="M0 255 Q60 240 120 258 Q180 275 240 255 Q300 235 360 258 Q420 275 480 255 L480 320 L0 320 Z" fill="url(#water)" opacity="0.55" />
      <rect x="190" y="140" width="50" height="50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
      <rect x="196" y="148" width="12" height="15" fill="#93c5fd" rx="1" />
      <rect x="214" y="148" width="12" height="15" fill="#93c5fd" rx="1" />
      <rect x="232" y="148" width="12" height="15" fill="#93c5fd" rx="1" />
      <rect x="206" y="163" width="20" height="27" fill="#bfdbfe" rx="1" />
      <rect x="185" y="140" width="60" height="6" fill="#334155" rx="1" />
      <ellipse cx="60" cy="190" rx="18" ry="22" fill="#22c55e" />
      <rect x="57" y="207" width="6" height="14" fill="#92400e" />
      <ellipse cx="430" cy="185" rx="20" ry="24" fill="#16a34a" />
      <rect x="427" y="204" width="6" height="16" fill="#92400e" />
      <circle cx="230" cy="120" r="10" fill="#ef4444" />
      <path d="M230 130 L225 140 L230 136 L235 140 Z" fill="#ef4444" />
      <circle cx="230" cy="120" r="4" fill="white" />
    </svg>
  );
}

function GISIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#0f172a" rx="12" />
      {[40, 80, 120, 160, 200, 240, 280].map(x => (
        <line key={`vx${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#1e293b" strokeWidth="1" />
      ))}
      {[40, 80, 120, 160].map(y => (
        <line key={`hy${y}`} x1="0" y1={y} x2="320" y2={y} stroke="#1e293b" strokeWidth="1" />
      ))}
      <polygon points="40,40 120,30 130,90 50,100" fill="#166534" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" />
      <polygon points="130,30 220,25 230,85 130,90" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" />
      <polygon points="50,100 130,90 140,155 60,160" fill="#166534" stroke="#22c55e" strokeWidth="1.5" opacity="0.9" />
      <polygon points="130,90 230,85 240,150 140,155" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <polygon points="230,25 300,30 305,90 230,85" fill="#166534" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" />
      <text x="82" y="68" fontSize="9" fill="#86efac" fontWeight="600">KH-1024</text>
      <text x="165" y="60" fontSize="9" fill="#86efac" fontWeight="600">KH-1025</text>
      <text x="86" y="128" fontSize="9" fill="#86efac" fontWeight="600">KH-2011</text>
      <text x="175" y="122" fontSize="9" fill="#86efac" fontWeight="600">KH-2012</text>
      <circle cx="90" cy="65" r="5" fill="#ef4444" />
      <path d="M90 70 L87 77 L90 74 L93 77 Z" fill="#ef4444" />
      <circle cx="182" cy="55" r="5" fill="#ef4444" />
      <path d="M182 60 L179 67 L182 64 L185 67 Z" fill="#ef4444" />
      <circle cx="185" cy="120" r="5" fill="#60a5fa" />
      <path d="M185 125 L182 132 L185 129 L188 132 Z" fill="#60a5fa" />
      <rect x="20" y="182" width="60" height="4" fill="#22c55e" rx="2" opacity="0.7" />
      <text x="20" y="196" fontSize="8" fill="#4ade80">0</text>
      <text x="56" y="196" fontSize="8" fill="#4ade80">500m</text>
      <circle cx="292" cy="25" r="14" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="292" y="18" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">N</text>
      <path d="M292 20 L289 30 L292 27 L295 30 Z" fill="#ef4444" />
      <path d="M292 20 L289 30 L292 33 L295 30 Z" fill="#475569" />
    </svg>
  );
}

function DocIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill="#eff6ff" rx="12" />
      <rect x="80" y="120" width="110" height="60" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" rx="4" />
      <rect x="85" y="110" width="110" height="60" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5" rx="4" />
      <rect x="90" y="100" width="110" height="60" fill="white" stroke="#93c5fd" strokeWidth="1.5" rx="4" />
      <line x1="100" y1="115" x2="180" y2="115" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="125" x2="190" y2="125" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="135" x2="175" y2="135" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="145" x2="185" y2="145" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="175" cy="140" r="14" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="175" cy="140" r="9" fill="none" stroke="#f59e0b" strokeWidth="1" />
      <text x="175" y="144" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="bold">GOVT</text>
      <circle cx="230" cy="80" r="30" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M230 95 L230 68" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M222 76 L230 68 L238 76" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="220" y="96" width="20" height="4" rx="2" fill="#60a5fa" />
      <rect x="20" y="52" width="55" height="18" rx="9" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
      <text x="47" y="64" textAnchor="middle" fontSize="9" fill="#166534" fontWeight="600">Deed</text>
      <rect x="20" y="78" width="65" height="18" rx="9" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="52" y="90" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="600">Porcha</text>
      <rect x="20" y="104" width="65" height="18" rx="9" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1" />
      <text x="52" y="116" textAnchor="middle" fontSize="9" fill="#5b21b6" fontWeight="600">Khatian</text>
      <rect x="20" y="130" width="75" height="18" rx="9" fill="#fce7f3" stroke="#fbcfe8" strokeWidth="1" />
      <text x="57" y="142" textAnchor="middle" fontSize="9" fill="#9d174d" fontWeight="600">Mutation</text>
      <rect x="20" y="156" width="80" height="18" rx="9" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />
      <text x="60" y="168" textAnchor="middle" fontSize="9" fill="#0c4a6e" fontWeight="600">Tax Receipt</text>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [division, setDivision] = useState<Division>("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [searchType, setSearchType] = useState<SearchType>("khatian");
  const [searchQuery, setSearchQuery] = useState("");

  const SERVICES = [
    {
      Icon: ScrollText, bg: "bg-emerald-50", ic: "text-emerald-600", bdr: "hover:border-emerald-200",
      title: "E-Mutation (নামজারি)",
      desc: "Submit mutation applications with digitized sale deeds. Track queue progress, resolve desk officer queries, and print mutation certificates online.",
      href: "/dashboard/user", lbl: "Start Petition", lc: "text-emerald-600",
    },
    {
      Icon: Coins, bg: "bg-teal-50", ic: "text-teal-600", bdr: "hover:border-teal-200",
      title: "LD Tax (ভূমি উন্নয়ন কর)",
      desc: "Calculate yearly land development taxes using Khatian area data. Pay via MFS or card and instantly download your Dakhila tax clearance certificate.",
      href: "/dashboard/user", lbl: "Calculate & Pay Tax", lc: "text-teal-600",
    },
    {
      Icon: Map, bg: "bg-indigo-50", ic: "text-indigo-600", bdr: "hover:border-indigo-200",
      title: "Mauza Maps (মৌজা ম্যাপ)",
      desc: "Search, review, and request certified prints of registered Mauza maps and satellite property boundaries. Check overlapping parcel coordinates in high resolution.",
      href: "/gallery", lbl: "Explore Gallery", lc: "text-indigo-600",
    },
    {
      Icon: BarChart3, bg: "bg-violet-50", ic: "text-violet-600", bdr: "hover:border-violet-200",
      title: "Land Records Search",
      desc: "Search by Khatian No, Dag No, Owner Name, or Mouza across all 8 divisions and 64 districts. View CS, SA, RS, BS, and LR record types instantly.",
      href: "/services", lbl: "Search Records", lc: "text-violet-600",
    },
    {
      Icon: Upload, bg: "bg-orange-50", ic: "text-orange-600", bdr: "hover:border-orange-200",
      title: "Document Vault",
      desc: "Upload and store Deed, Porcha, Khatian, Mutation, Tax Receipt, Survey Map, NID, and other critical land documents in one secure cloud vault.",
      href: "/dashboard/user", lbl: "Manage Documents", lc: "text-orange-600",
    },
    {
      Icon: Bell, bg: "bg-rose-50", ic: "text-rose-600", bdr: "hover:border-rose-200",
      title: "Status & Notifications",
      desc: "Track petition statuses in real time. Receive instant SMS and email alerts for mutation approvals, tax due dates, and document verifications.",
      href: "/dashboard/user", lbl: "View Notifications", lc: "text-rose-600",
    },
  ];

  const DOCS = [
    { label: "Deed", Icon: FileText },
    { label: "Porcha", Icon: ScrollText },
    { label: "Khatian", Icon: Landmark },
    { label: "Mutation", Icon: FileCheck },
    { label: "Tax Receipt", Icon: Receipt },
    { label: "Survey Map", Icon: Map },
    { label: "NID", Icon: ShieldCheck },
    { label: "Other Files", Icon: Upload },
  ];

  const LAND_FIELDS = [
    { f: "Dag No", d: "Parcel number" },
    { f: "Khatian", d: "Ownership record" },
    { f: "Mouza", d: "Revenue village" },
    { f: "JL No", d: "Jurisdiction list" },
    { f: "CS / SA / RS / BS / LR", d: "Survey types" },
    { f: "District", d: "64 districts" },
    { f: "Upazila", d: "Sub-district" },
    { f: "Union", d: "Local govt." },
    { f: "Village", d: "Mauza level" },
    { f: "Area (Decimal)", d: "Katha / Bigha / Acre" },
    { f: "Owner", d: "Full owner info" },
    { f: "Purchase Info", d: "Transaction data" },
    { f: "Status", d: "Active / Disputed" },
    { f: "Coordinates", d: "Lat / Long / GeoJSON" },
    { f: "Documents", d: "Linked files" },
  ];

  const FUTURE = [
    { Icon: FileText, label: "OCR Auto-Read", bg: "bg-violet-50", ic: "text-violet-600" },
    { Icon: Globe, label: "AI Auto Fill", bg: "bg-blue-50", ic: "text-blue-600" },
    { Icon: QrCode, label: "QR Code Deeds", bg: "bg-emerald-50", ic: "text-emerald-600" },
    { Icon: Bell, label: "SMS / Email Alerts", bg: "bg-orange-50", ic: "text-orange-600" },
    { Icon: Smartphone, label: "Mobile App", bg: "bg-pink-50", ic: "text-pink-600" },
    { Icon: Pen, label: "Digital Signature", bg: "bg-teal-50", ic: "text-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      <main className="flex-grow">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full" />
            <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-teal-400/8 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Text */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Government of Bangladesh &bull; ILMIS
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 bg-clip-text text-transparent">
                  Bangladesh Digital Land Management System
                </h1>

                <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Verify smart ownership deeds (Khatian), pay land development tax, track mutation petitions, upload documents, and inspect Mauza maps — all on one secure decentralized platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/dashboard/user"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-emerald-200">
                    Go to My Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/features"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:border-emerald-300 hover:text-emerald-700 transition-colors">
                    <Globe className="w-4 h-4" />
                    Explore Features
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-1">
                  {["Blockchain Secured", "NID Verified", "e-Porcha Ready"].map(b => (
                    <span key={b} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="relative w-full max-w-md mx-auto lg:max-w-none aspect-[3/2]">
                <div className="absolute inset-0 rounded-2xl border border-emerald-100 overflow-hidden shadow-xl shadow-emerald-100/50">
                  <LandIllustration />
                </div>
                {/* Badge bottom-left */}
                <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white rounded-xl border border-slate-200 shadow-lg px-3 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Registry Match Rate</p>
                    <p className="text-sm font-extrabold text-emerald-600">99.8% Verified</p>
                  </div>
                </div>
                {/* Badge top-right */}
                <div className="absolute -top-4 -right-3 sm:-right-5 bg-white rounded-xl border border-slate-200 shadow-lg px-3 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Digitized Khatians</p>
                    <p className="text-sm font-extrabold text-slate-800">4.8M+ Records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search Widget ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Search Land Records Ledger
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Division */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Division</label>
                <select
                  value={division}
                  onChange={e => {
                    const d = e.target.value as Division;
                    setDivision(d);
                    setDistrict(DISTRICTS[d][0]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                  {Object.keys(DISTRICTS).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                  {DISTRICTS[division].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Search By */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Search By</label>
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value as SearchType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                  <option value="khatian">Khatian No (খতিয়ান)</option>
                  <option value="dag">Dag No (দাগ নম্বর)</option>
                  <option value="owner">Owner Name (মালিকের নাম)</option>
                  <option value="mouza">Mouza (মৌজা)</option>
                </select>
              </div>

              {/* Value input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enter Value</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === "khatian" ? "e.g. 1024" :
                      searchType === "dag" ? "e.g. 2087" :
                        searchType === "owner" ? "Owner name..." : "Mouza name..."
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
              </div>

              {/* Button */}
              <div className="flex flex-col justify-end">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Search className="w-4 h-4" />
                  Search Records
                </button>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center">Quick:</span>
              {["CS Khatian", "SA Khatian", "RS Khatian", "BS Khatian", "LR Khatian"].map(tag => (
                <button key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Statistics ───────────────────────────────────────────────────── */}
        <section className="bg-slate-900 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { val: "4.8M+", label: "Digitized Khatians", color: "text-emerald-400" },
                { val: "99.8%", label: "Registry Match Rate", color: "text-teal-400" },
                { val: "12.5k", label: "Mauzas Indexed", color: "text-sky-400" },
                { val: "180k+", label: "Completed Mutations", color: "text-violet-400" },
              ].map(({ val, label, color }) => (
                <div key={label} className="space-y-2">
                  <p className={`text-3xl sm:text-4xl font-extrabold ${color}`}>{val}</p>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Services ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">What You Can Do</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Key Citizen Services</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Access core digital land services instantly — no Tehsil office visit needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {SERVICES.map(({ Icon: LucideIcon, bg, ic, bdr, title, desc, href, lbl, lc }) => (
              <div key={title}
                className={`p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 ${bdr} hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4`}>
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${ic}`}>
                    <LucideIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
                <Link href={href} className={`text-xs font-semibold ${lc} flex items-center gap-1 group w-fit`}>
                  {lbl}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── GIS Section ──────────────────────────────────────────────────── */}
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Text */}
              <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">GIS & Mapping</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Interactive Land Boundary Mapping
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Draw polygon boundaries, edit parcel limits, calculate area in Decimal / Katha / Bigha / Acre, and overlay satellite or terrain imagery — stored as GeoJSON in PostGIS.
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    "Pin Location (GPS)", "Draw Polygon",
                    "Boundary Editing", "Area Calculation",
                    "Satellite / Terrain / Hybrid", "Lat / Long Export",
                    "GeoJSON Storage", "Parcel Overlap Detection",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/features"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors">
                  Explore GIS Features <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* GIS Illustration */}
              <div className="relative aspect-[8/5] order-1 lg:order-2 max-w-lg mx-auto lg:max-w-none w-full">
                <div className="absolute inset-0 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                  <GISIllustration />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Documents Section ─────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Doc Illustration */}
            <div className="relative aspect-[8/5] max-w-lg mx-auto lg:max-w-none w-full">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl border border-blue-100 overflow-hidden shadow-xl shadow-blue-100/40">
                <DocIllustration />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Document Management</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                All Your Land Documents in One Secure Vault
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload, organize, and access all critical land documents digitally. Securely stored in the cloud with instant retrieval — no more lost paperwork.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DOCS.map(({ label, Icon: LucideIcon }) => (
                  <div key={label}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-default group">
                    <LucideIcon className="w-4 h-4 mx-auto mb-1 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <p className="text-[11px] font-semibold text-slate-600 group-hover:text-blue-700 transition-colors">{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/user"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors">
                Upload Documents <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Land Fields ───────────────────────────────────────────────────── */}
        <section className="bg-slate-100/60 border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Fields</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Comprehensive Land Record Fields</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Every land parcel is captured with a full set of standardized fields across all 64 districts.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {LAND_FIELDS.map(({ f, d }) => (
                <div key={f}
                  className="bg-white border border-slate-200 rounded-xl p-3 hover:border-emerald-300 hover:shadow-sm transition-all cursor-default">
                  <p className="text-xs font-bold text-slate-700">{f}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Future Features ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Coming Soon</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Future-Ready Technology</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              BDLMS continuously evolves with cutting-edge capabilities on the roadmap.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FUTURE.map(({ Icon: LucideIcon, label, bg, ic }) => (
              <div key={label}
                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-sm hover:border-slate-300 transition-all text-center">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${ic}`}>
                  <LucideIcon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">{label}</p>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Soon</span>
              </div>
            ))}
          </div>
        </section>



        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div className="relative space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Register Your Land Records Today
              </h2>
              <p className="text-sm text-emerald-100 max-w-xl mx-auto">
                Join over 4.8 million citizens who have digitized their land ownership. Secure, verified, and accessible anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 font-extrabold text-sm rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}