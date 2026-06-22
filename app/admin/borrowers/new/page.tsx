import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { NewBorrowerForm } from "@/components/admin/NewBorrowerForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function NewBorrowerPage(){return <div className="mx-auto max-w-4xl space-y-6"><Button asChild variant="ghost" className="-ml-3"><Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4"/>Kembali ke dashboard</Link></Button><div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><UserPlus className="h-5 w-5"/></span><div><h1 className="text-3xl font-bold">Tambah peminjam</h1><p className="mt-1 text-muted-foreground">Buat profil dan catat pinjaman pertamanya.</p></div></div><Card><CardHeader className="border-b bg-muted/25"><CardTitle>Data peminjam & pinjaman</CardTitle><CardDescription>Kolom bertanda bintang wajib diisi.</CardDescription></CardHeader><CardContent className="p-6 sm:p-8"><NewBorrowerForm/></CardContent></Card></div>}
