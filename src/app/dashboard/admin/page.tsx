interface MutationCase {
  id: string;
  applicant: string;
  propertyId: string;
  type: string;
  dateSubmitted: string;
  status: "Review Required" | "In Progress";
}

const PENDING_CASES: MutationCase[] = [
  {
    id: "MUT-8819",
    applicant: "Rahim Islam",
    propertyId: "PROP-1033",
    type: "Ownership Transfer",
    dateSubmitted: "2026-06-24",
    status: "Review Required",
  },
  {
    id: "MUT-8722",
    applicant: "Sumona Begum",
    propertyId: "PROP-9201",
    type: "Inheritance Division",
    dateSubmitted: "2026-06-22",
    status: "In Progress",
  },
  {
    id: "MUT-8504",
    applicant: "Farhana Parveen",
    propertyId: "PROP-3042",
    type: "Lease Registration",
    dateSubmitted: "2026-06-20",
    status: "Review Required",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-500 text-xs mt-1">
            System overview, registry integrity validation, and pending mutation review queue.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-55 border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm">
            Generate Audit Log
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm">
            Configure System
          </button>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered Owners</span>
          <p className="text-3xl font-extrabold text-slate-800">41,209</p>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% vs last quarter</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Mutation Review</span>
          <p className="text-3xl font-extrabold text-amber-600">42 Cases</p>
          <p className="text-[10px] text-slate-500 font-medium">Average response: 2.4 days</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Today</span>
          <p className="text-3xl font-extrabold text-emerald-600">14 Titles</p>
          <p className="text-[10px] text-slate-500 font-medium">Security audit matches 100%</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disputed Parcels</span>
          <p className="text-3xl font-extrabold text-rose-600">3 Conflicts</p>
          <p className="text-[10px] text-slate-550 font-medium">Marked for land survey team</p>
        </div>
      </div>

      {/* Mutation Cases Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-850 text-base">Pending Mutation Queue</h3>
            <p className="text-slate-500 text-xs mt-1">Review requests and verify deed hashes.</p>
          </div>
          <span className="text-xs text-slate-650 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 font-semibold">
            Show: All Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="p-4 pl-6">Case ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Property ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm">
              {PENDING_CASES.map((kase) => (
                <tr key={kase.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800">{kase.id}</td>
                  <td className="p-4 text-slate-700 font-semibold">{kase.applicant}</td>
                  <td className="p-4 text-slate-500">{kase.propertyId}</td>
                  <td className="p-4 text-slate-550">{kase.type}</td>
                  <td className="p-4 text-slate-400 font-medium">{kase.dateSubmitted}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        kase.status === "Review Required"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {kase.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button className="bg-slate-50 hover:bg-slate-100 text-xs font-semibold py-1.5 px-3 rounded border border-slate-200 text-slate-650 transition-colors">
                      Reject
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold py-1.5 px-3 rounded text-white transition-colors shadow-sm">
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
