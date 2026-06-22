"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { createLoan } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddLoanForm({ borrowerId }: { borrowerId: string }) {
  const router = useRouter(); const [open,setOpen]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  if(!open)return <Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/>Tambah Pinjaman</Button>;
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;setLoading(true);setError("");const result=await createLoan(borrowerId,new FormData(form));setLoading(false);if(result.ok){form.reset();setOpen(false);router.refresh()}else setError(result.error)}
  return <form onSubmit={submit} className="space-y-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Pinjaman baru</h3><p className="text-sm text-muted-foreground">Tambahkan pinjaman tanpa mengubah pinjaman sebelumnya.</p></div><Button type="button" variant="ghost" size="icon" onClick={()=>setOpen(false)}><X className="h-4 w-4"/></Button></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="new-principal">Jumlah pinjaman *</Label><CurrencyInput id="new-principal" name="principal" required placeholder="Rp 5.000.000"/></div><div className="space-y-2"><Label htmlFor="new-interest">Bunga (%)</Label><Input id="new-interest" name="interest" type="number" min="0" defaultValue="0"/></div><div className="space-y-2"><Label htmlFor="new-start">Tanggal mulai *</Label><Input id="new-start" name="startDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)}/></div><div className="space-y-2"><Label htmlFor="new-due">Jatuh tempo (opsional)</Label><Input id="new-due" name="dueDate" type="date"/></div></div><div className="space-y-2"><Label htmlFor="new-description">Keterangan</Label><Textarea id="new-description" name="description" placeholder="Keperluan pinjaman..."/></div>{error&&<p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Button disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>}{loading?"Menyimpan...":"Simpan Pinjaman"}</Button></form>;
}
