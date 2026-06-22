import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NewBorrowerForm } from "@/components/admin/NewBorrowerForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function NewBorrowerPage(){return <div className="mx-auto max-w-3xl space-y-5"><Button asChild variant="ghost" className="-ml-3"><Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4"/>Kembali</Link></Button><Card><CardHeader><CardTitle className="text-2xl">Tambah Peminjam</CardTitle><CardDescription>Masukkan identitas dan pinjaman pertama.</CardDescription></CardHeader><CardContent><NewBorrowerForm/></CardContent></Card></div>}
