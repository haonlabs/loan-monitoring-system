"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, X } from "lucide-react";
import { updateLoanDescription } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EditLoanDescriptionForm({ borrowerId, loanId, description }: { borrowerId: string; loanId: string; description: string }) {
  const router = useRouter();
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  if(!open)return <Button type="button" variant="outline" size="sm" onClick={()=>setOpen(true)}><Pencil className="h-4 w-4"/>Edit keterangan</Button>;
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setError("");const result=await updateLoanDescription(borrowerId,loanId,new FormData(event.currentTarget));setLoading(false);if(result.ok){setOpen(false);router.refresh()}else setError(result.error)}
  return <form onSubmit={submit} className="space-y-3 rounded-xl border bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><h4 className="font-semibold">Edit keterangan pinjaman</h4><Button type="button" variant="ghost" size="icon" onClick={()=>setOpen(false)}><X className="h-4 w-4"/></Button></div><div className="space-y-2"><Label htmlFor={`loan-description-${loanId}`}>Keterangan</Label><Textarea id={`loan-description-${loanId}`} name="description" defaultValue={description} placeholder="Keperluan pinjaman..."/></div>{error&&<p role="alert" className="text-sm text-red-600">{error}</p>}<Button size="sm" disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Pencil className="h-4 w-4"/>}{loading?"Menyimpan...":"Simpan keterangan"}</Button></form>;
}
