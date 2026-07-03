"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function DashboardLandingPage() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "partner") {
      router.replace("/dashboard/landdocuments");
    }
  }, [role, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
    </div>
  );
}
