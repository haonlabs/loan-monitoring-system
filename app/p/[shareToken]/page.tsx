import { Landmark, ShieldCheck } from "lucide-react";
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

  return <main className="min-h-screen"><header className="border-b bg-white"><div className="mx-auto flex h-16 max-w-4xl items-center gap-2 px-4 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"><Landmark className="h-5 w-5" /></span>Pantau Pinjaman</div></header><div className="mx-auto max-w-4xl space-y-7 p-4 py-8 sm:p-8">
    <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-blue-100">Status seluruh pinjaman</p><h1 className="mt-1 text-3xl font-bold">Halo, {borrower.name}!</h1></div><LoanStatus status={status} large /></div><p className="mt-5 flex items-center gap-2 text-sm text-blue-100"><ShieldCheck className="h-4 w-4" />Informasi ini hanya dapat dibuka melalui akses unik Anda.</p></section>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Jumlah pinjaman</p><p className="mt-2 text-2xl font-bold">{borrower.loans.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total gabungan</p><p className="mt-2 text-lg font-bold">{formatRupiah(total)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-lg font-bold text-emerald-600">{formatRupiah(paid)}</p></CardContent></Card><Card className="border-blue-200 bg-blue-50/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sisa gabungan</p><p className="mt-2 text-lg font-bold text-blue-700">{formatRupiah(remaining)}</p></CardContent></Card></div>

    <section className="space-y-4"><div><h2 className="text-xl font-bold">Rincian pinjaman</h2><p className="text-sm text-muted-foreground">Setiap pinjaman dan pembayarannya ditampilkan terpisah.</p></div>{borrower.loans.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada pinjaman.</CardContent></Card> : borrower.loans.map((loan, index) => {
      const payments = borrower.payments.filter(payment => payment.loanId === loan.id);
      const proofs=borrower.proofs.filter(proof=>proof.loanId===loan.id);
      return <Card key={loan.id} className="overflow-hidden"><CardHeader className="border-b bg-slate-50/70"><div className="flex items-center justify-between gap-3"><div><CardTitle>Pinjaman #{borrower.loans.length - index}</CardTitle><CardDescription className="mt-2">{loan.description || "Tanpa keterangan"}</CardDescription></div><LoanStatus status={calculateLoanStatus(loan)} /></div></CardHeader><CardContent className="space-y-6 p-5 sm:p-6"><LoanDetail loan={loan} publicView /><div className="border-t pt-5"><h3 className="font-semibold">Riwayat pembayaran</h3><PaymentHistory payments={payments} /></div><div className="space-y-4 border-t pt-5"><div><h3 className="font-semibold">Bukti transfer</h3><p className="text-sm text-muted-foreground">Anda dan pemberi pinjaman dapat menambahkan bukti.</p></div><ProofUploadForm borrowerId={borrower.id} loanId={loan.id} role="borrower" shareToken={params.shareToken}/><ProofGallery proofs={proofs} borrowerId={borrower.id} shareToken={params.shareToken}/></div></CardContent></Card>;
    })}</section>

    <footer className="border-t py-6 text-center text-sm text-muted-foreground">Jika ada pertanyaan, hubungi pemberi pinjaman secara langsung.</footer>
  </div></main>;
}
