import Link from "next/link";
import { ArrowLeft, ChevronDown, KeyRound, Link2, Phone, StickyNote, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { getBorrower } from "@/lib/data";
import { calculateLoanStatus, formatRupiah, generateShareUrl } from "@/lib/utils";
import { ShareButton } from "@/components/admin/ShareButton";
import { PaymentForm } from "@/components/admin/PaymentForm";
import { DeletePaymentButton } from "@/components/admin/DeletePaymentButton";
import { EditBorrowerForm } from "@/components/admin/EditBorrowerForm";
import { CopyVerificationCode } from "@/components/admin/CopyVerificationCode";
import { BorrowerActions } from "@/components/admin/BorrowerActions";
import { AddLoanForm } from "@/components/admin/AddLoanForm";
import { LoanActions } from "@/components/admin/LoanActions";
import { LoanDetail } from "@/components/borrower/LoanDetail";
import { LoanStatus } from "@/components/borrower/LoanStatus";
import { PaymentHistory } from "@/components/borrower/PaymentHistory";
import { ProofUploadForm } from "@/components/borrower/ProofUploadForm";
import { ProofGallery } from "@/components/borrower/ProofGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function BorrowerDetailPage({ params, searchParams }: { params: { borrowerId: string }; searchParams: { loanPage?: string } }) {
  const borrower = await getBorrower(params.borrowerId);
  if (!borrower) notFound();
  const verifyCode = borrower.verifyCode || "";
  const totalAmount = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const remainingAmount = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const paidAmount = totalAmount - remainingAmount;
  const perPage = 5;
  const totalLoanPages = Math.max(1, Math.ceil(borrower.loans.length / perPage));
  const currentLoanPage = Math.min(totalLoanPages, Math.max(1, Number(searchParams.loanPage) || 1));
  const paginatedLoans = borrower.loans.slice((currentLoanPage - 1) * perPage, currentLoanPage * perPage);
  const loanPageUrl = (page: number) => page > 1 ? `/admin/borrowers/${borrower.id}?loanPage=${page}` : `/admin/borrowers/${borrower.id}`;

  return <div className="space-y-8">
    <Button asChild variant="ghost" className="-ml-3"><Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4" />Kembali ke dashboard</Link></Button>
    <Card className="overflow-hidden"><div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"/><CardContent className="p-6 sm:p-8"><div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between"><div className="flex min-w-0 items-start gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><UserRound className="h-6 w-6"/></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Profil peminjam</p><h1 className="mt-1 truncate text-3xl font-bold sm:text-4xl">{borrower.name}</h1><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{borrower.phone || "Nomor WhatsApp belum diisi"}</p>{borrower.tags.length>0&&<div className="mt-3 flex flex-wrap gap-2">{borrower.tags.map(tag=><span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">{tag}</span>)}</div>}</div></div><div className="flex flex-wrap gap-2"><EditBorrowerForm borrower={{ id: borrower.id, name: borrower.name, phone: borrower.phone, notes: borrower.notes, tags: borrower.tags }} /><BorrowerActions borrowerId={borrower.id} /></div></div><div className="mt-7 grid gap-4 border-t pt-6 lg:grid-cols-2"><div className="rounded-xl bg-muted/60 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><KeyRound className="h-3.5 w-3.5"/>Kode akses peminjam</div><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><p className="font-mono text-2xl font-bold tracking-[.28em]">{verifyCode || "Belum diatur"}</p><CopyVerificationCode code={verifyCode} borrowerId={borrower.id}/></div></div><div className="rounded-xl bg-amber-50/70 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700"><StickyNote className="h-3.5 w-3.5"/>Catatan pribadi</div><p className="mt-3 text-sm leading-6 text-amber-950">{borrower.notes || "Belum ada catatan pribadi."}</p></div></div></CardContent></Card>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Jumlah pinjaman</p><p className="mt-2 text-3xl font-bold">{borrower.loans.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Total gabungan</p><p className="mt-2 text-xl font-bold">{formatRupiah(totalAmount)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-xl font-bold text-emerald-600">{formatRupiah(paidAmount)}</p></CardContent></Card><Card className="border-indigo-100 bg-indigo-50/60"><CardContent className="p-5"><p className="text-sm font-medium text-muted-foreground">Sisa gabungan</p><p className="mt-2 text-xl font-bold text-indigo-700">{formatRupiah(remainingAmount)}</p></CardContent></Card></div>

    <Card><CardHeader className="sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Tambah pinjaman</CardTitle><CardDescription className="mt-1">Peminjam dapat memiliki pinjaman baru meski yang sebelumnya belum lunas.</CardDescription></div></CardHeader><CardContent><AddLoanForm borrowerId={borrower.id} /></CardContent></Card>

    <section className="space-y-4"><div><h2 className="text-xl font-bold">Daftar pinjaman</h2><p className="text-sm text-muted-foreground">Setiap pinjaman memiliki pembayaran dan status terpisah.</p></div>{borrower.loans.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada pinjaman.</CardContent></Card> : <>
      {paginatedLoans.map((loan, index) => {
        const status = calculateLoanStatus(loan);
        const payments = borrower.payments.filter(payment => payment.loanId === loan.id);
        const proofs=borrower.proofs.filter(proof=>proof.loanId===loan.id);
        const loanNumber = borrower.loans.length - ((currentLoanPage - 1) * perPage + index);
        return <details key={loan.id} className="group overflow-hidden rounded-xl border bg-card"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-muted/40 p-5 marker:hidden"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-bold">Pinjaman #{loanNumber}</h3><LoanStatus status={status} /></div><p className="mt-2 truncate text-sm text-muted-foreground">{loan.description || "Tanpa keterangan"}</p><p className="mt-2 text-sm font-semibold text-indigo-700">Sisa {formatRupiah(loan.remainingAmount)}</p></div><ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition group-open:rotate-180"/></summary><div className="space-y-8 p-5 sm:p-7"><div className="flex justify-end"><LoanActions borrowerId={borrower.id} loanId={loan.id} isPaid={status === "paid"} /></div><LoanDetail loan={loan} /><div className="rounded-xl border bg-muted/20 p-5"><h3 className="mb-1 font-bold">Catat pembayaran</h3><p className="mb-5 text-sm text-muted-foreground">Pembayaran masuk khusus ke Pinjaman #{loanNumber}.</p><PaymentForm borrowerId={borrower.id} loanId={loan.id} remainingAmount={loan.remainingAmount} /></div><div className="border-t pt-7"><h3 className="font-bold">Riwayat pembayaran</h3><PaymentHistory payments={payments} actions={payment => <DeletePaymentButton borrowerId={borrower.id} paymentId={payment.id} />} /></div><div className="space-y-4 border-t pt-7"><div><h3 className="font-bold">Bukti transfer</h3><p className="mt-1 text-sm text-muted-foreground">Bukti dari kedua pihak dapat dilihat bersama.</p></div><ProofUploadForm borrowerId={borrower.id} loanId={loan.id} role="lender"/><ProofGallery proofs={proofs} borrowerId={borrower.id}/></div></div></details>;
      })}
      {totalLoanPages > 1 && <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Halaman {currentLoanPage} dari {totalLoanPages}</p><div className="flex gap-2"><Button asChild variant="outline" size="sm" className={currentLoanPage===1?"pointer-events-none opacity-50":""}><Link href={loanPageUrl(currentLoanPage-1)}>Sebelumnya</Link></Button><Button asChild variant="outline" size="sm" className={currentLoanPage===totalLoanPages?"pointer-events-none opacity-50":""}><Link href={loanPageUrl(currentLoanPage+1)}>Berikutnya</Link></Button></div></div>}
    </>}</section>

    <Card><CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Link2 className="h-4 w-4"/></span><div><CardTitle>Bagikan status pinjaman</CardTitle><CardDescription className="mt-1">Satu link menampilkan seluruh pinjaman peminjam ini.</CardDescription></div></div></CardHeader><CardContent className="space-y-4"><code className="block overflow-x-auto rounded-xl border bg-muted/60 p-4 text-sm">{generateShareUrl(borrower.shareToken)}</code><ShareButton borrowerName={borrower.name} shareToken={borrower.shareToken} verifyCode={verifyCode} phoneNumber={borrower.phone} /></CardContent></Card>
  </div>;
}
