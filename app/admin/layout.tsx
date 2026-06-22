import Link from "next/link";
import { Landmark } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <><header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"><Link href="/admin/dashboard" className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"><Landmark className="h-5 w-5" /></span>Pantau Pinjaman</Link><LogoutButton /></div></header><main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main></>;
}
