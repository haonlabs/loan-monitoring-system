import { redirect } from "next/navigation";
import { Landmark } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin/dashboard");
  return <main className="flex min-h-screen items-center justify-center p-4"><Card className="w-full max-w-md"><CardHeader className="text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Landmark /></div><CardTitle className="text-2xl">Masuk sebagai Pemberi Pinjaman</CardTitle><CardDescription>Kelola peminjam dan catat pembayaran dengan aman.</CardDescription></CardHeader><CardContent><LoginForm /></CardContent></Card></main>;
}
