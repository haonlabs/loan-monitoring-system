"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { createLoan } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddLoanForm({ borrowerId }: { borrowerId: string }) {
  const router = useRouter(); const [open,setOpen]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  if(!open)return <Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/>Tambah Pinjaman</Button>;
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;setLoading(true);setError("");const result=await createLoan(borrowerId,new FormData(form));setLoading(false);if(result.ok){form.reset();setOpen(false);router.refresh()}else setError(result.error)}
  return <form onSubmit={submit} className="space-y-5 rounded-xl border bg-muted/30 p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">Pinjaman baru</h3><p className="mt-1 text-sm text-muted-foreground">Data pinjaman lama tetap tersimpan terpisah.</p></div><Button type="button" variant="ghost" size="icon" onClick={()=>setOpen(false)}><X className="h-4 w-4"/></Button></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="new-principal">Jumlah pinjaman *</Label><CurrencyInput id="new-principal" name="principal" required placeholder="Rp 5.000.000"/></div><div className="space-y-2"><Label htmlFor="new-interest">Bunga (%)</Label><Input id="new-interest" name="interest" type="number" min="0" placeholder="Opsional"/></div><div className="space-y-2"><Label htmlFor="new-start">Tanggal mulai *</Label><DatePicker id="new-start" name="startDate" required defaultValue={new Date().toLocaleDateString("en-CA")} placeholder="Pilih tanggal mulai"/></div><div className="space-y-2"><Label htmlFor="new-due">Jatuh tempo</Label><DatePicker id="new-due" name="dueDate" placeholder="Tidak ditentukan"/></div></div><div className="space-y-2"><Label htmlFor="new-description">Keterangan</Label><Textarea id="new-description" name="description" placeholder="Keperluan pinjaman..."/></div>{error&&<p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}<div className="flex justify-end"><Button disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>}{loading?"Menyimpan...":"Simpan pinjaman"}</Button></div></form>;
}
