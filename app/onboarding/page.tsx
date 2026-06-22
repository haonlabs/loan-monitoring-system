import Link from "next/link";
import { ArrowLeft, LockKeyhole, Search } from "lucide-react";
import { OnboardingForm } from "@/components/borrower/OnboardingForm";

export default function OnboardingPage() {
  return <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white"><div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl"/><div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"/><div className="absolute inset-0 opacity-30 page-grid"/>
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8"><div className="w-full max-w-md space-y-6"><Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"><ArrowLeft className="h-4 w-4"/>Kembali ke beranda</Link>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.07] shadow-2xl backdrop-blur-xl"><div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"/>
        <div className="px-6 pb-6 pt-8 text-center sm:px-8"><span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300"><Search className="h-6 w-6"/></span><h1 className="text-2xl font-bold">Lihat status pinjaman</h1><p className="mt-2 text-sm leading-6 text-slate-400">Cari nama lengkapmu, lalu gunakan kode akses dari pemberi pinjaman.</p></div>
        <div className="px-6 pb-8 sm:px-8"><OnboardingForm/></div>
        <div className="border-t border-white/5 px-6 py-4 sm:px-8"><p className="flex items-center justify-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-3.5 w-3.5"/>Kode verifikasi tidak pernah ditampilkan ke publik</p></div>
      </div>
    </div></div>
  </main>;
}
