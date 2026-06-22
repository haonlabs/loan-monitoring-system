import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Landmark, ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin/dashboard");
  return <main className="page-grid flex min-h-screen items-center justify-center p-4 sm:p-8"><div className="w-full max-w-md space-y-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4"/>Kembali ke beranda</Link><Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-border"><div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"/><CardHeader className="px-6 pb-5 pt-8 text-center sm:px-8"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"><Landmark /></div><CardTitle className="text-2xl">Masuk sebagai pemberi pinjaman</CardTitle><CardDescription className="mx-auto mt-2 max-w-xs leading-6">Kelola data peminjam, pembayaran, dan bukti transfer dengan aman.</CardDescription></CardHeader><CardContent className="px-6 pb-8 sm:px-8"><LoginForm/><p className="mt-6 flex items-center justify-center gap-2 border-t pt-5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600"/>Sesi masuk dilindungi dan bersifat privat</p></CardContent></Card></div></main>;
}
