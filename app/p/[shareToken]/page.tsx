import Link from "next/link";
import { Landmark, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";
import { notFound } from "next/navigation";
import { getBorrowerByToken } from "@/lib/data";
import { calculateBorrowerStatus, calculateLoanStatus, formatRupiah } from "@/lib/utils";
import { LoanDetail } from "@/components/borrower/LoanDetail";
import { LoanStatus } from "@/components/borrower/LoanStatus";
import { PaymentHistory } from "@/components/borrower/PaymentHistory";
import { ProofUploadForm } from "@/components/borrower/ProofUploadForm";
import { ProofGallery } from "@/components/borrower/ProofGallery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function PublicLoanPage({ params }: { params: { shareToken: string } }) {
  const borrower = await getBorrowerByToken(params.shareToken);
  if (!borrower) notFound();
  const status = calculateBorrowerStatus(borrower.loans);
  const total = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const remaining = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const paid = total - remaining;

  return <main className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"><Link href="/" className="flex items-center gap-2.5 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"><Landmark className="h-4 w-4" /></span>tagihanku</Link><span className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5"/>Akses privat</span></div></header><div className="mx-auto max-w-5xl space-y-8 p-4 py-8 sm:p-8">
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl"/><div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-indigo-300"><WalletCards className="h-4 w-4"/>Ringkasan pinjaman</p><h1 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Halo, {borrower.name}!</h1><p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-400" />Halaman ini hanya bisa dibuka melalui akses unikmu.</p></div><LoanStatus status={status} large /></div></section>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Jumlah pinjaman</p><p className="mt-2 text-3xl font-bold">{borrower.loans.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Total gabungan</p><p className="mt-2 text-lg font-bold">{formatRupiah(total)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-lg font-bold text-emerald-600">{formatRupiah(paid)}</p></CardContent></Card><Card className="border-indigo-100 bg-indigo-50/60"><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sisa gabungan</p><p className="mt-2 text-lg font-bold text-indigo-700">{formatRupiah(remaining)}</p></CardContent></Card></div>

    <section className="space-y-4"><div><h2 className="text-xl font-bold">Rincian pinjaman</h2><p className="text-sm text-muted-foreground">Setiap pinjaman dan pembayarannya ditampilkan terpisah.</p></div>{borrower.loans.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada pinjaman.</CardContent></Card> : borrower.loans.map((loan, index) => {
      const payments = borrower.payments.filter(payment => payment.loanId === loan.id);
      const proofs=borrower.proofs.filter(proof=>proof.loanId===loan.id);
      return <Card key={loan.id} className="overflow-hidden"><CardHeader className="border-b bg-muted/40"><div className="flex items-center justify-between gap-3"><div><CardTitle className="text-xl">Pinjaman #{borrower.loans.length - index}</CardTitle><CardDescription className="mt-2">{loan.description || "Tanpa keterangan"}</CardDescription></div><LoanStatus status={calculateLoanStatus(loan)} /></div></CardHeader><CardContent className="space-y-7 p-5 sm:p-7"><LoanDetail loan={loan} publicView /><div className="border-t pt-6"><h3 className="font-bold">Riwayat pembayaran</h3><PaymentHistory payments={payments} /></div><div className="space-y-4 border-t pt-6"><div><h3 className="font-bold">Bukti transfer</h3><p className="mt-1 text-sm text-muted-foreground">Kamu dan pemberi pinjaman dapat menambahkan bukti.</p></div><ProofUploadForm borrowerId={borrower.id} loanId={loan.id} role="borrower" shareToken={params.shareToken}/><ProofGallery proofs={proofs} borrowerId={borrower.id} shareToken={params.shareToken}/></div></CardContent></Card>;
    })}</section>

    <footer className="border-t py-6 text-center text-sm text-muted-foreground">Jika ada pertanyaan, hubungi pemberi pinjaman secara langsung.</footer>
  </div></main>;
}
