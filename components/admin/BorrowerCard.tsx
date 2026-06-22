import Link from "next/link";
import type { BorrowerWithLoans } from "@/types";
import { calculateBorrowerStatus, formatLoanDuration, formatRupiah, statusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShareButton } from "./ShareButton";

export function BorrowerCard({ borrower }: { borrower: BorrowerWithLoans }) {
  const status = calculateBorrowerStatus(borrower.loans);
  const total = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const remaining = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const latest = borrower.loans[0];
  return <Card className="overflow-hidden"><CardContent className="space-y-5 p-5">
    <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{borrower.name}</p>{borrower.tags.length>0&&<div className="mt-1 flex flex-wrap gap-1">{borrower.tags.map(tag=><span key={tag} className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-300">{tag}</span>)}</div>}<p className="mt-1 text-sm text-muted-foreground">{borrower.loans.length} pinjaman{latest ? ` · terbaru ${formatLoanDuration(latest.startDate)}` : ""}</p></div><Badge variant={status === "paid" ? "paid" : status === "overdue" ? "overdue" : "default"}>{statusLabel(status)}</Badge></div>
    <div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-muted-foreground">Total gabungan</span><p className="font-medium">{formatRupiah(total)}</p></div><div><span className="text-muted-foreground">Sisa gabungan</span><p className="font-semibold">{formatRupiah(remaining)}</p></div></div>
    <div className="flex items-center gap-2 border-t pt-4"><Button asChild size="sm" className="flex-1"><Link href={`/admin/borrowers/${borrower.id}`}>Lihat detail<ChevronRight className="h-4 w-4"/></Link></Button><ShareButton compact borrowerName={borrower.name} shareToken={borrower.shareToken} verifyCode={borrower.verifyCode} phoneNumber={borrower.phone} /></div>
  </CardContent></Card>;
}
