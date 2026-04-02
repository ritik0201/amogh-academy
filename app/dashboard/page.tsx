"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardRedirector() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      router.push("/login");
      return;
    }

    const { role } = session.user;

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "teacher") {
      router.push("/teacher/dashboard");
    } else {
      router.push("/student/dashboard"); // Default to student
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accessing Portal...</h2>
        <p className="text-slate-500 font-medium">Securing your session and redirecting you to your workspace.</p>
      </div>
    </div>
  );
}
