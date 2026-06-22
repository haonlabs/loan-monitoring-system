import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
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
export default async function BorrowerDetailPage({ params }: { params: { borrowerId: string } }) {
  const borrower = await getBorrower(params.borrowerId);
  if (!borrower) notFound();
  const verifyCode = borrower.verifyCode || "";
  const totalAmount = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const remainingAmount = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const paidAmount = totalAmount - remainingAmount;

  return <div className="space-y-6">
    <Button asChild variant="ghost" className="-ml-3"><Link href="/admin/dashboard"><ArrowLeft className="h-4 w-4" />Kembali ke dashboard</Link></Button>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div><h1 className="text-2xl font-bold sm:text-3xl">{borrower.name}</h1><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{borrower.phone || "Nomor WhatsApp belum diisi"}</p>{borrower.tags.length>0&&<div className="mt-3 flex flex-wrap gap-2">{borrower.tags.map(tag=><span key={tag} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">{tag}</span>)}</div>}<div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border bg-white p-3"><div><p className="text-xs text-muted-foreground">Kode verifikasi</p><p className="font-mono text-xl font-bold tracking-[.3em]">{verifyCode || "Belum diatur"}</p></div><CopyVerificationCode code={verifyCode} /></div>{borrower.notes && <p className="mt-3 max-w-2xl rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Catatan pribadi: {borrower.notes}</p>}</div>
      <div className="flex flex-col items-start gap-2"><EditBorrowerForm borrower={{ id: borrower.id, name: borrower.name, phone: borrower.phone, notes: borrower.notes, verifyCode, tags: borrower.tags }} /><BorrowerActions borrowerId={borrower.id} /></div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Jumlah pinjaman</p><p className="mt-2 text-2xl font-bold">{borrower.loans.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total gabungan</p><p className="mt-2 text-xl font-bold">{formatRupiah(totalAmount)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sudah dibayar</p><p className="mt-2 text-xl font-bold text-emerald-600">{formatRupiah(paidAmount)}</p></CardContent></Card><Card className="border-blue-200 bg-blue-50/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sisa gabungan</p><p className="mt-2 text-xl font-bold text-blue-700">{formatRupiah(remainingAmount)}</p></CardContent></Card></div>

    <Card><CardHeader><CardTitle>Tambah pinjaman</CardTitle><CardDescription>Peminjam dapat memiliki pinjaman baru meski pinjaman sebelumnya belum lunas.</CardDescription></CardHeader><CardContent><AddLoanForm borrowerId={borrower.id} /></CardContent></Card>

    <section className="space-y-4"><div><h2 className="text-xl font-bold">Daftar pinjaman</h2><p className="text-sm text-muted-foreground">Setiap pinjaman memiliki pembayaran dan status terpisah.</p></div>{borrower.loans.length === 0 ? <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada pinjaman.</CardContent></Card> : borrower.loans.map((loan, index) => {
      const status = calculateLoanStatus(loan);
      const payments = borrower.payments.filter(payment => payment.loanId === loan.id);
      const proofs=borrower.proofs.filter(proof=>proof.loanId===loan.id);
      return <Card key={loan.id} className="overflow-hidden"><CardHeader className="border-b bg-slate-50/70"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><CardTitle>Pinjaman #{borrower.loans.length - index}</CardTitle><LoanStatus status={status} /></div><CardDescription className="mt-2">{loan.description || "Tanpa keterangan"}</CardDescription></div><LoanActions borrowerId={borrower.id} loanId={loan.id} isPaid={status === "paid"} /></div></CardHeader><CardContent className="space-y-7 p-5 sm:p-6"><LoanDetail loan={loan} /><div className="border-t pt-6"><h3 className="mb-1 font-semibold">Catat pembayaran pinjaman ini</h3><p className="mb-4 text-sm text-muted-foreground">Pembayaran akan masuk hanya ke Pinjaman #{borrower.loans.length - index}.</p><PaymentForm borrowerId={borrower.id} loanId={loan.id} remainingAmount={loan.remainingAmount} /></div><div className="border-t pt-6"><h3 className="font-semibold">Riwayat pembayaran</h3><PaymentHistory payments={payments} actions={payment => <DeletePaymentButton borrowerId={borrower.id} paymentId={payment.id} />} /></div><div className="space-y-4 border-t pt-6"><div><h3 className="font-semibold">Bukti transfer</h3><p className="text-sm text-muted-foreground">Bukti dari kedua pihak dapat dilihat bersama.</p></div><ProofUploadForm borrowerId={borrower.id} loanId={loan.id} role="lender"/><ProofGallery proofs={proofs} borrowerId={borrower.id}/></div></CardContent></Card>;
    })}</section>

    <Card><CardHeader><CardTitle>Bagikan status pinjaman</CardTitle><CardDescription>Satu link menampilkan seluruh pinjaman milik peminjam ini.</CardDescription></CardHeader><CardContent className="space-y-4"><code className="block overflow-x-auto rounded-lg bg-slate-100 p-3 text-sm">{generateShareUrl(borrower.shareToken)}</code><ShareButton borrowerName={borrower.name} shareToken={borrower.shareToken} phoneNumber={borrower.phone} /></CardContent></Card>
  </div>;
}
