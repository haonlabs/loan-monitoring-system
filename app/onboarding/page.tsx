import Link from "next/link";
import { ArrowLeft, LockKeyhole, Search } from "lucide-react";
import { OnboardingForm } from "@/components/borrower/OnboardingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  return <main className="page-grid flex min-h-screen items-center justify-center p-4 sm:p-8"><div className="w-full max-w-md space-y-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke beranda</Link><Card className="overflow-visible border-0 shadow-2xl ring-1 ring-border"><div className="h-1.5 rounded-t-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"/><CardHeader className="px-6 pb-5 pt-8 text-center sm:px-8"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Search className="h-6 w-6" /></div><CardTitle className="text-2xl">Lihat status pinjaman</CardTitle><CardDescription className="mx-auto mt-2 max-w-xs leading-6">Cari nama lengkapmu, lalu gunakan kode akses dari pemberi pinjaman.</CardDescription></CardHeader><CardContent className="px-6 pb-8 sm:px-8"><OnboardingForm/><p className="mt-6 flex items-center justify-center gap-2 border-t pt-5 text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5"/>Kode verifikasi tidak pernah ditampilkan ke publik</p></CardContent></Card></div></main>;
}
