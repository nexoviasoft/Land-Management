import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  area: string;
  status: "Verified" | "Pending" | "Disputed";
  color: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Greenwood Agricultural Valley",
    category: "Agricultural",
    location: "Sylhet Sadar, Sylhet",
    area: "4.5 Acres",
    status: "Verified",
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "2",
    title: "Banasree Commercial Plot B-3",
    category: "Commercial",
    location: "Rampura, Dhaka",
    area: "10 Katha",
    status: "Verified",
    color: "from-blue-600 to-indigo-500",
  },
  {
    id: "3",
    title: "Purbachal Residential Block K",
    category: "Residential",
    location: "Savar, Dhaka",
    area: "7.5 Katha",
    status: "Pending",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "4",
    title: "Chittagong Hills Tea Estate Extension",
    category: "Special Estate",
    location: "Sreemangal, Moulvibazar",
    area: "12.8 Acres",
    status: "Verified",
    color: "from-amber-600 to-orange-500",
  },
  {
    id: "5",
    title: "Cox's Bazar Beachfront Zone D",
    category: "Tourism/Commercial",
    location: "Marine Drive, Cox's Bazar",
    area: "1.2 Acres",
    status: "Disputed",
    color: "from-rose-600 to-red-500",
  },
  {
    id: "6",
    title: "Gazipur Industrial Zone Section 4",
    category: "Industrial",
    location: "Joydebpur, Gazipur",
    area: "3.2 Acres",
    status: "Verified",
    color: "from-cyan-600 to-blue-500",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="space-y-12">
          {/* Header text */}
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              Records Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Registered Lands Gallery
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Explore cataloged holdings, verified spatial mappings, and designated land development projects.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Block simulating map/image */}
                <div className={`h-48 bg-gradient-to-br ${item.color} relative p-6 flex flex-col justify-between`}>
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px]"></div>
                  
                  {/* Category Tag */}
                  <span className="relative z-10 self-start text-xs font-bold uppercase tracking-wider bg-white/30 backdrop-blur-md px-2.5 py-1 rounded text-white">
                    {item.category}
                  </span>

                  {/* SVG Land Layout Mockup */}
                  <div className="absolute right-4 bottom-4 w-28 h-28 opacity-30 group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white" strokeWidth="2">
                      <polygon points="10,20 40,10 90,30 80,80 30,90 10,70" />
                      <line x1="40" y1="10" x2="30" y2="90" />
                      <line x1="10" y1="70" x2="90" y2="30" />
                    </svg>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`relative z-10 self-end text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm ${
                      item.status === "Verified"
                        ? "text-emerald-700"
                        : item.status === "Pending"
                        ? "text-amber-700"
                        : "text-rose-700"
                    }`}
                  >
                    ● {item.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Registered Area</span>
                    <span className="text-slate-800 font-bold">{item.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
