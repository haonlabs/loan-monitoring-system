import Link from "next/link";
import { redirect } from "next/navigation";
import { Landmark, LogIn, Search } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  if (await getCurrentAdmin()) redirect("/admin/dashboard");
  return <main className="flex min-h-screen items-center justify-center p-4"><Card className="w-full max-w-lg overflow-hidden"><div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Landmark className="h-7 w-7" /></div><h1 className="text-3xl font-bold">Pantau Pinjaman</h1><p className="mt-2 text-blue-100">Informasi pinjaman yang jelas, aman, dan mudah diakses.</p></div><CardContent className="grid gap-3 p-6 sm:grid-cols-2"><Button asChild size="lg"><Link href="/onboarding"><Search className="h-4 w-4" />Lihat status pinjamanmu</Link></Button><Button asChild size="lg" variant="outline"><Link href="/login"><LogIn className="h-4 w-4" />Pemberi Pinjaman</Link></Button></CardContent></Card></main>;
}
