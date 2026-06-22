"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { markLoanPaid } from "@/app/actions";
import { Button } from "@/components/ui/button";
export function LoanActions({borrowerId,loanId,isPaid}:{borrowerId:string;loanId:string;isPaid:boolean}){const router=useRouter();const[loading,setLoading]=useState(false);async function mark(){if(!window.confirm("Tandai pinjaman ini sebagai lunas? Seluruh sisa akan dicatat sebagai pembayaran terakhir."))return;setLoading(true);const result=await markLoanPaid(borrowerId,loanId);setLoading(false);if(!result.ok)return window.alert(result.error);router.refresh()}return <Button type="button" variant="outline" size="sm" onClick={mark} disabled={isPaid||loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<CircleCheckBig className="h-4 w-4 text-emerald-600"/>}{isPaid?"Sudah Lunas":loading?"Memproses...":"Tandai Lunas"}</Button>}
