"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteBorrower } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function BorrowerActions({ borrowerId }: { borrowerId: string }) {
  const router = useRouter();
  const [action, setAction] = useState<"delete" | null>(null);

  async function remove() {
    if (!window.confirm("Hapus peminjam ini beserta seluruh pinjaman dan riwayat pembayarannya? Tindakan ini tidak dapat dibatalkan.")) return;
    setAction("delete");
    const result = await deleteBorrower(borrowerId);
    if (!result.ok) { setAction(null); return window.alert(result.error); }
    router.replace("/admin/dashboard"); router.refresh();
  }

  return <div className="flex flex-wrap gap-2">
    <Button type="button" variant="destructive" onClick={remove} disabled={action !== null}>
      {action === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {action === "delete" ? "Menghapus..." : "Hapus Peminjam"}
    </Button>
  </div>;
}
