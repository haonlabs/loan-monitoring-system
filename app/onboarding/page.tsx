import Link from "next/link";
import { ArrowLeft, Landmark } from "lucide-react";
import { OnboardingForm } from "@/components/borrower/OnboardingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  return <main className="flex min-h-screen items-center justify-center p-4"><div className="w-full max-w-md space-y-4"><Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali</Link><Card><CardHeader className="text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><Landmark /></div><CardTitle className="text-2xl">Lihat status pinjaman</CardTitle><CardDescription>Masukkan nama lengkap dan kode verifikasi Anda.</CardDescription></CardHeader><CardContent><OnboardingForm /></CardContent></Card></div></main>;
}
