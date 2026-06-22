import type { Loan } from "@/types";
import { calculatePaidPercentage, daysUntilDue, formatDate, formatLoanDuration, formatRupiah } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function LoanDetail({ loan, publicView = false }: { loan: Loan; publicView?: boolean }) {
  const paid = loan.totalAmount - loan.remainingAmount;
  const percentage = calculatePaidPercentage(loan);
  const days = loan.dueDate ? daysUntilDue(loan.dueDate) : null;

  return <div className="space-y-5">
    <div className={`grid gap-4 ${publicView ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
      <div className="rounded-xl border bg-background p-5"><p className="text-sm font-medium text-muted-foreground">{publicView ? "Total pinjaman" : "Pokok pinjaman"}</p><p className="mt-2 text-xl font-bold">{formatRupiah(publicView ? loan.totalAmount : loan.principal)}</p></div>
      {!publicView && loan.interest > 0 && <div className="rounded-xl border bg-background p-5"><p className="text-sm font-medium text-muted-foreground">Total dengan bunga ({loan.interest}%)</p><p className="mt-2 text-xl font-bold">{formatRupiah(loan.totalAmount)}</p></div>}
      <div className="rounded-xl border bg-background p-5"><p className="text-sm font-medium text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-xl font-bold text-emerald-400">{formatRupiah(paid)}</p></div>
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-5"><p className="text-sm font-medium text-muted-foreground">Sisa pinjaman</p><p className="mt-2 text-2xl font-bold text-indigo-300">{formatRupiah(loan.remainingAmount)}</p></div>
    </div>
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-3 flex justify-between text-sm"><span className="font-medium">Progres pelunasan</span><b className="text-primary">{percentage}%</b></div>
      <Progress value={percentage} />
      <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
        <span>Mulai: <b className="text-foreground">{formatDate(loan.startDate)}</b></span>
        <span>Sudah berjalan: <b className="text-foreground">{formatLoanDuration(loan.startDate)}</b></span>
        <span>Jatuh tempo: <b className="text-foreground">{loan.dueDate ? formatDate(loan.dueDate) : "Tidak ditentukan"}</b></span>
        {days !== null && <span className={days < 0 ? "font-semibold text-red-400" : ""}>{days < 0 ? `${Math.abs(days)} hari lewat` : days === 0 ? "Jatuh tempo hari ini" : `${days} hari lagi`}</span>}
      </div>
    </div>
  </div>;
}
