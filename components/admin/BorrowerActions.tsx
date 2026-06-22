"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteBorrower } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function BorrowerActions({ borrowerId }: { borrowerId: string }) {
  const router = useRouter();
  const [action, setAction] = useState<"delete" | null>(null);

  async function remove() {
    setAction("delete");
    const result = await deleteBorrower(borrowerId);
    if (!result.ok) { setAction(null); return window.alert(result.error); }
    router.replace("/admin/dashboard"); router.refresh();
  }

  return <AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="destructive" disabled={action !== null}>
      {action === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {action === "delete" ? "Menghapus..." : "Hapus Peminjam"}
    </Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus peminjam ini?</AlertDialogTitle><AlertDialogDescription>Seluruh pinjaman, pembayaran, dan bukti terkait akan ikut dihapus permanen. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ya, hapus peminjam</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
