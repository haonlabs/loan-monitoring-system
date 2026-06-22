"use client";
import { useState } from "react";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { regenerateVerifyCode } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function CopyVerificationCode({ code, borrowerId }: { code: string; borrowerId:string }) {
  const [copied, setCopied] = useState(false);
  const [loading,setLoading]=useState(false);const router=useRouter();
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  async function regenerate(){if(!window.confirm("Buat kode verifikasi baru? Kode lama tidak dapat digunakan lagi."))return;setLoading(true);const result=await regenerateVerifyCode(borrowerId);setLoading(false);if(!result.ok)return window.alert(result.error);router.refresh()}
  return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size="sm" onClick={copy} disabled={!code}>
    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
    {copied ? "Tersalin!" : "Salin Kode"}
  </Button><Button type="button" variant="outline" size="sm" onClick={regenerate} disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<RefreshCw className="h-4 w-4"/>}{loading?"Membuat...":"Buat Kode Baru"}</Button></div>;
}
