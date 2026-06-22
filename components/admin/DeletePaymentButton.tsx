"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deletePayment } from "@/app/actions";
import { Button } from "@/components/ui/button";
export function DeletePaymentButton({borrowerId,paymentId}:{borrowerId:string;paymentId:string}){const router=useRouter();const[loading,setLoading]=useState(false);return <Button aria-label="Hapus pembayaran" title="Hapus pembayaran" variant="ghost" size="icon" disabled={loading} onClick={async()=>{if(!window.confirm("Hapus pembayaran ini? Sisa hutang akan dikembalikan."))return;setLoading(true);const r=await deletePayment(borrowerId,paymentId);setLoading(false);if(!r.ok)alert(r.error);else router.refresh()}}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4 text-red-600"/>}</Button>}
