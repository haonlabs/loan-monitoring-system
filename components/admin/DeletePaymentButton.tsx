"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deletePayment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
export function DeletePaymentButton({borrowerId,paymentId}:{borrowerId:string;paymentId:string}){const router=useRouter();const[loading,setLoading]=useState(false);async function remove(){setLoading(true);const r=await deletePayment(borrowerId,paymentId);setLoading(false);if(!r.ok)alert(r.error);else router.refresh()}return <AlertDialog><AlertDialogTrigger asChild><Button aria-label="Hapus pembayaran" title="Hapus pembayaran" variant="ghost" size="icon" disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4 text-red-600"/>}</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus pembayaran?</AlertDialogTitle><AlertDialogDescription>Catatan pembayaran akan dihapus dan nominalnya dikembalikan ke sisa pinjaman.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus pembayaran</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>}
