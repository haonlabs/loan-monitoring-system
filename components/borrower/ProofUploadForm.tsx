"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { uploadBorrowerProof, uploadLenderProof } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props={borrowerId:string;loanId:string;role:"borrower"|"lender";shareToken?:string};
export function ProofUploadForm({borrowerId,loanId,role,shareToken}:Props){
  const router=useRouter();const[loading,setLoading]=useState(false);const[message,setMessage]=useState<{ok:boolean;text:string}|null>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;setLoading(true);setMessage(null);const data=new FormData(form);const result=role==="lender"?await uploadLenderProof(borrowerId,loanId,data):await uploadBorrowerProof(shareToken||"",loanId,data);setLoading(false);if(result.ok){form.reset();setMessage({ok:true,text:"Bukti transfer berhasil diunggah."});router.refresh()}else setMessage({ok:false,text:result.error})}
  return <form onSubmit={submit} className="space-y-4 rounded-xl border border-dashed bg-muted/30 p-4 sm:p-5"><div><h4 className="font-bold">Upload bukti transfer <span className="font-normal text-muted-foreground">(opsional)</span></h4><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP, atau PDF · maksimal 3 MB.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor={`proof-${role}-${loanId}`}>File bukti</Label><Input className="cursor-pointer file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-primary" id={`proof-${role}-${loanId}`} name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></div><div className="space-y-2"><Label htmlFor={`caption-${role}-${loanId}`}>Keterangan</Label><Input id={`caption-${role}-${loanId}`} name="caption" maxLength={200} placeholder="Contoh: Transfer cicilan Mei"/></div></div>{message&&<p role="status" className={`rounded-lg p-3 text-sm ${message.ok?"bg-emerald-500/10 text-emerald-400":"bg-red-500/10 text-red-400"}`}>{message.text}</p>}<Button disabled={loading} size="sm">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<FileUp className="h-4 w-4"/>}{loading?"Mengunggah...":"Upload bukti"}</Button></form>;
}
