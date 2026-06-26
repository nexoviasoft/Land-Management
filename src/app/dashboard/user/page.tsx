import Link from "next/link";

interface UserProperty {
  id: string;
  location: string;
  area: string;
  khatianNo: string;
  status: "Verified" | "Pending Approval";
}

const MY_PROPERTIES: UserProperty[] = [
  {
    id: "PROP-9921",
    location: "House 45, Road 12, Banasree, Dhaka",
    area: "5 Katha",
    khatianNo: "CS-2931 / DP-841",
    status: "Verified",
  },
  {
    id: "PROP-4820",
    location: "Plot 302, Sector 15, Uttara, Dhaka",
    area: "3.5 Katha",
    khatianNo: "DP-992 / SA-122",
    status: "Verified",
  },
  {
    id: "PROP-1033",
    location: "Mauza: Singair, Manikganj (Agri Plot)",
    area: "1.2 Acres",
    khatianNo: "BS-192 / RS-828",
    status: "Pending Approval",
  },
];

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Citizen Portal</h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage your registered property deeds, view taxes, and track pending mutation applications.
          </p>
        </div>
        <button className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Apply for Mutation
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Lands Registered</span>
          <p className="text-3xl font-extrabold text-slate-800">3 Parcels</p>
          <p className="text-[10px] text-slate-500 font-medium">Cumulative Area: 1.25 Acres</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax Status</span>
          <p className="text-3xl font-extrabold text-emerald-600">Paid</p>
          <p className="text-[10px] text-slate-500 font-medium">Next payment due: Nov 2026</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Applications</span>
          <p className="text-3xl font-extrabold text-amber-600">1 Pending</p>
          <p className="text-[10px] text-slate-500 font-medium">Submitted 3 days ago</p>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-850 text-base">My Registered Properties</h3>
          <p className="text-slate-500 text-xs mt-1">Verified deeds associated with your National ID registry.</p>
        </div>
        <div className="divide-y divide-slate-150">
          {MY_PROPERTIES.map((prop) => (
            <div key={prop.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/55">
                    {prop.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Khatian: <span className="text-slate-800 font-semibold">{prop.khatianNo}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{prop.location}</h4>
                <p className="text-xs text-slate-500 font-medium">Registered land area: {prop.area}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    prop.status === "Verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {prop.status}
                </span>
                <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-850 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Board / Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm">Notice Board</h4>
          <ul className="space-y-3 text-xs text-slate-500 font-medium">
            <li className="flex gap-2">
              <span className="text-emerald-600 font-bold shrink-0 bg-emerald-50 px-1 rounded">NEW</span>
              <span>All land tax returns must be filed digitally using E-Khazana from July 1st.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-400 font-bold shrink-0 bg-slate-100 px-1 rounded">1w ago</span>
              <span>Manual verification camps will be active in Manikganj district offices next week.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm">Mutation Guideline</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Need to change registry ownership? Make sure you have a registered purchase deed, last 25 years chain of deeds, and active E-Khazana tax payment receipts ready.
          </p>
          <Link href="/about" className="text-xs text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1">
            Read Registry Process
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
