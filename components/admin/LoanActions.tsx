"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { markLoanPaid } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export function LoanActions({borrowerId,loanId,isPaid}:{borrowerId:string;loanId:string;isPaid:boolean}){const router=useRouter();const[loading,setLoading]=useState(false);async function mark(){setLoading(true);const result=await markLoanPaid(borrowerId,loanId);setLoading(false);if(!result.ok)return window.alert(result.error);router.refresh()}return <AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="outline" size="sm" disabled={isPaid||loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<CircleCheckBig className="h-4 w-4 text-emerald-400"/>}{isPaid?"Sudah lunas":loading?"Memproses...":"Tandai lunas"}</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Tandai pinjaman sebagai lunas?</AlertDialogTitle><AlertDialogDescription>Seluruh sisa pinjaman akan dicatat sebagai pembayaran terakhir pada hari ini.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={mark}>Ya, tandai lunas</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>}
