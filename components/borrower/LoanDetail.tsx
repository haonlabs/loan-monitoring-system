import type { Loan } from "@/types";
import { calculatePaidPercentage, daysUntilDue, formatDate, formatLoanDuration, formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LoanDetail({ loan, publicView = false }: { loan: Loan; publicView?: boolean }) {
  const paid = loan.totalAmount - loan.remainingAmount;
  const percentage = calculatePaidPercentage(loan);
  const days = loan.dueDate ? daysUntilDue(loan.dueDate) : null;

  return <div className="space-y-5">
    <div className={`grid gap-4 ${publicView ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
      <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{publicView ? "Total pinjaman" : "Pokok pinjaman"}</p><p className="mt-2 text-xl font-bold">{formatRupiah(publicView ? loan.totalAmount : loan.principal)}</p></CardContent></Card>
      {!publicView && loan.interest > 0 && <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total dengan bunga ({loan.interest}%)</p><p className="mt-2 text-xl font-bold">{formatRupiah(loan.totalAmount)}</p></CardContent></Card>}
      <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-xl font-bold text-emerald-600">{formatRupiah(paid)}</p></CardContent></Card>
      <Card className="border-blue-200 bg-blue-50/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sisa hutang</p><p className="mt-2 text-2xl font-bold text-blue-700">{formatRupiah(loan.remainingAmount)}</p></CardContent></Card>
    </div>
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-2 flex justify-between text-sm"><span>Progres pelunasan</span><b>{percentage}%</b></div>
      <Progress value={percentage} />
      <div className="mt-5 flex flex-col justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
        <span>Mulai: <b className="text-foreground">{formatDate(loan.startDate)}</b></span>
        <span>Sudah berjalan: <b className="text-foreground">{formatLoanDuration(loan.startDate)}</b></span>
        <span>Jatuh tempo: <b className="text-foreground">{loan.dueDate ? formatDate(loan.dueDate) : "Tidak ditentukan"}</b></span>
        {days !== null && <span className={days < 0 ? "font-semibold text-red-600" : ""}>{days < 0 ? `${Math.abs(days)} hari lewat` : days === 0 ? "Jatuh tempo hari ini" : `${days} hari lagi`}</span>}
      </div>
    </div>
  </div>;
}
