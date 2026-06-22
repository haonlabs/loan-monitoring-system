import Link from "next/link";
import { ChevronDown, Landmark, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";
import { notFound } from "next/navigation";
import { getBorrowerByToken } from "@/lib/data";
import { calculateBorrowerStatus, calculateLoanStatus, formatRupiah } from "@/lib/utils";
import { LoanDetail } from "@/components/borrower/LoanDetail";
import { LoanStatus } from "@/components/borrower/LoanStatus";
import { PaymentHistory } from "@/components/borrower/PaymentHistory";
import { ProofUploadForm } from "@/components/borrower/ProofUploadForm";
import { ProofGallery } from "@/components/borrower/ProofGallery";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationLinks } from "@/components/ui/pagination-links";

export const dynamic = "force-dynamic";
export default async function PublicLoanPage({ params, searchParams }: { params: { shareToken: string }; searchParams: Record<string, string | undefined> }) {
  const borrower = await getBorrowerByToken(params.shareToken);
  if (!borrower) notFound();
  const status = calculateBorrowerStatus(borrower.loans);
  const total = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const remaining = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const paid = total - remaining;
  const perPage = 5;
  const totalLoanPages = Math.max(1, Math.ceil(borrower.loans.length / perPage));
  const currentLoanPage = Math.min(totalLoanPages, Math.max(1, Number(searchParams.loanPage) || 1));
  const paginatedLoans = borrower.loans.slice((currentLoanPage - 1) * perPage, currentLoanPage * perPage);
  const pageUrl = (updates: Record<string, number>) => { const query=new URLSearchParams(); if(currentLoanPage>1)query.set("loanPage",String(currentLoanPage)); Object.entries(updates).forEach(([key,value])=>value>1?query.set(key,String(value)):query.delete(key)); const paramsText=query.toString(); return paramsText?`/p/${params.shareToken}?${paramsText}`:`/p/${params.shareToken}`; };

  return <main className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"><Link href="/" className="flex items-center gap-2.5 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"><Landmark className="h-4 w-4" /></span>tagihanku</Link><span className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5"/>Akses privat</span></div></header><div className="mx-auto max-w-5xl space-y-8 p-4 py-8 sm:p-8">
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl"/><div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-indigo-300"><WalletCards className="h-4 w-4"/>Ringkasan pinjaman</p><h1 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Halo, {borrower.name}!</h1><p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><ShieldCheck className="h-4 w-4 text-emerald-400" />Halaman ini hanya bisa dibuka melalui akses unikmu.</p></div><LoanStatus status={status} large /></div></section>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Jumlah pinjaman</p><p className="mt-2 text-3xl font-bold">{borrower.loans.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Total gabungan</p><p className="mt-2 text-lg font-bold">{formatRupiah(total)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-lg font-bold text-emerald-400">{formatRupiah(paid)}</p></CardContent></Card><Card className="border-indigo-500/20 bg-indigo-500/10"><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sisa gabungan</p><p className="mt-2 text-lg font-bold text-indigo-300">{formatRupiah(remaining)}</p></CardContent></Card></div>

    <section className="space-y-4"><div><h2 className="text-xl font-bold">Rincian pinjaman</h2><p className="text-sm text-muted-foreground">Setiap pinjaman dan pembayarannya ditampilkan terpisah.</p></div>{borrower.loans.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada pinjaman.</CardContent></Card> : <>
      {paginatedLoans.map((loan, index) => {
        const payments = borrower.payments.filter(payment => payment.loanId === loan.id);
        const proofs=borrower.proofs.filter(proof=>proof.loanId===loan.id);
        const loanNumber = borrower.loans.length - ((currentLoanPage - 1) * perPage + index);
        const loanStatus = calculateLoanStatus(loan);
        const paymentPageKey = `paymentPage-${loan.id}`;
        const paymentPage = Math.max(1, Number(searchParams[paymentPageKey]) || 1);
        return <details key={loan.id} className="group overflow-hidden rounded-xl border bg-card"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-muted/40 p-5 marker:hidden"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-bold">Pinjaman #{loanNumber}</h3><LoanStatus status={loanStatus} /></div><p className="mt-2 truncate text-sm text-muted-foreground">{loan.description || "Tanpa keterangan"}</p><p className="mt-2 text-sm font-semibold text-indigo-300">Sisa {formatRupiah(loan.remainingAmount)}</p></div><ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition group-open:rotate-180"/></summary><div className="space-y-7 p-5 sm:p-7"><LoanDetail loan={loan} publicView /><div className="border-t pt-6"><h3 className="font-bold">Riwayat pembayaran</h3><PaymentHistory payments={payments} currentPage={paymentPage} getPageHref={page=>pageUrl({[paymentPageKey]:page})} /></div><div className="space-y-4 border-t pt-6"><div><h3 className="font-bold">Bukti transfer</h3><p className="mt-1 text-sm text-muted-foreground">Kamu dan pemberi pinjaman dapat menambahkan bukti.</p></div><ProofUploadForm borrowerId={borrower.id} loanId={loan.id} role="borrower" shareToken={params.shareToken}/><ProofGallery proofs={proofs} borrowerId={borrower.id} shareToken={params.shareToken}/></div></div></details>;
      })}
      <PaginationLinks currentPage={currentLoanPage} totalPages={totalLoanPages} getHref={page=>pageUrl({loanPage:page})} />
    </>}</section>

    <footer className="border-t py-6 text-center text-sm text-muted-foreground">Jika ada pertanyaan, hubungi pemberi pinjaman secara langsung.</footer>
  </div></main>;
}
