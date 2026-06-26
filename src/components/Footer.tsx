import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-600">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-wide">
              LandSync
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            National Land Records & Ownership Verification Platform. Empowering citizens through secure, distributed registry solutions.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home Portal</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-emerald-600 transition-colors">Records Gallery</Link>
            </li>
            <li>
              <Link href="/mission" className="hover:text-emerald-600 transition-colors">Our Mission</Link>
            </li>
          </ul>
        </div>

        {/* Portals Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Portals</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dashboard/user" className="hover:text-emerald-600 transition-colors">User Citizen Console</Link>
            </li>
            <li>
              <Link href="/dashboard/admin" className="hover:text-emerald-600 transition-colors">Admin Registry Board</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-600 transition-colors">Support Center</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Government Support</h4>
          <div className="text-xs text-slate-500 space-y-2">
            <p>Ministry of Land, ICT Division Road</p>
            <p>Dhaka, Bangladesh</p>
            <p className="text-slate-700 font-semibold">Hotline: 16122 (Toll-Free)</p>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} LandSync. Integrated Land Management Information System (ILMIS).</p>
        <div className="flex space-x-4">
          <Link href="/contact" className="hover:text-slate-700">Terms of Registry</Link>
          <Link href="/contact" className="hover:text-slate-700">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
