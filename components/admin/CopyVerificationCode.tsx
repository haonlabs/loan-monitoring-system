"use client";
import { useState } from "react";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { regenerateVerifyCode } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function CopyVerificationCode({ code, borrowerId }: { code: string; borrowerId:string }) {
  const [copied, setCopied] = useState(false);
  const [loading,setLoading]=useState(false);const router=useRouter();
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  async function regenerate(){setLoading(true);const result=await regenerateVerifyCode(borrowerId);setLoading(false);if(!result.ok)return window.alert(result.error);router.refresh()}
  return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={copy} disabled={!code}>
    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    {copied ? "Tersalin!" : "Salin Kode"}
  </Button><AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="outline" size="sm" disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<RefreshCw className="h-4 w-4"/>}{loading?"Membuat...":"Buat kode baru"}</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Buat kode verifikasi baru?</AlertDialogTitle><AlertDialogDescription>Kode lama langsung tidak dapat digunakan. Berikan kode baru kepada peminjam secara manual.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={regenerate}>Buat kode baru</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>;
}
