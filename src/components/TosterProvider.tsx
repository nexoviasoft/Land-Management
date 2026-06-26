"use client";

import { Toaster } from "sonner";

export default function TosterProvider() {
  return (
    <Toaster
      richColors
      position="top-right"
      expand={false}
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: "var(--font-geist-sans)",
          fontSize: "13px",
          borderRadius: "10px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        },
        classNames: {
          loading:
            "!bg-white !text-slate-700 !border-slate-200",
          success:
            "!bg-white !text-emerald-700 !border-emerald-200",
          error:
            "!bg-white !text-rose-700 !border-rose-200",
          info:
            "!bg-white !text-blue-700 !border-blue-200",
          warning:
            "!bg-white !text-amber-700 !border-amber-200",
        },
      }}
    />
  );
}
