import Link from "next/link";

export default function DashboardLandingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800">Select Portal Access</h1>
        <p className="text-slate-550 text-sm">
          Welcome to the LandSync management console. Choose your access level to view and manage registered property ledgers.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-sm transition-all duration-300 p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">User Portal</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Access your personal deeds, track submitted mutation applications, pay taxes, and verify the verification status of your property parcels.
            </p>
          </div>
          <Link
            href="/dashboard/user"
            className="w-full bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold py-2.5 px-4 rounded-lg text-sm text-center block transition-colors border border-slate-200"
          >
            Enter User Console
          </Link>
        </div>

        {/* Admin Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-teal-500/50 hover:shadow-sm transition-all duration-300 p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors">Admin Portal</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Verify submitted property titles, review mutation conflicts, dispatch on-site inspection teams, and view system logs.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm text-center block transition-colors"
          >
            Enter Admin Console
          </Link>
        </div>
      </div>
    </div>
  );
}
