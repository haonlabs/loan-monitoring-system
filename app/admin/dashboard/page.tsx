import Link from "next/link";
import { Banknote, CircleCheckBig, Filter, Inbox, Plus, Tag as TagIcon, UsersRound, X } from "lucide-react";
import { getAllBorrowers } from "@/lib/data";
import { calculateBorrowerStatus, formatLoanDuration, formatRupiah, statusLabel } from "@/lib/utils";
import { DashboardSummary } from "@/components/admin/DashboardSummary";
import { BorrowerCard } from "@/components/admin/BorrowerCard";
import { ShareButton } from "@/components/admin/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";
export default async function Dashboard({ searchParams }: { searchParams: { status?: string; tag?: string } }) {
  const all = await getAllBorrowers();
  const statuses = all.map(borrower => calculateBorrowerStatus(borrower.loans));
  const summary = {
    totalReceivable: all.reduce((sum, borrower) => sum + borrower.loans.reduce((loanSum, loan) => loanSum + loan.remainingAmount, 0), 0),
    totalBorrowers: all.length,
    activeBorrowers: all.filter(borrower => borrower.loans.some(loan => loan.remainingAmount > 0)).length,
    paidBorrowers: statuses.filter(status => status === "paid").length,
    overdueBorrowers: statuses.filter(status => status === "overdue").length
  };
  const filter = searchParams.status || "all";
  const selectedTag = searchParams.tag || "all";
  const tags = Array.from(new Set(all.flatMap(borrower => borrower.tags))).sort((a,b)=>a.localeCompare(b,"id-ID"));
  const borrowers = all.filter(borrower => (filter === "all" || calculateBorrowerStatus(borrower.loans) === filter) && (selectedTag === "all" || borrower.tags.includes(selectedTag)));
  const taggedBorrowers = selectedTag === "all" ? [] : all.filter(borrower => borrower.tags.includes(selectedTag));
  const tagLoanCount = taggedBorrowers.reduce((sum, borrower) => sum + borrower.loans.length, 0);
  const tagTotalAmount = taggedBorrowers.reduce((sum, borrower) => sum + borrower.loans.reduce((loanSum, loan) => loanSum + loan.totalAmount, 0), 0);
  const tagRemainingAmount = taggedBorrowers.reduce((sum, borrower) => sum + borrower.loans.reduce((loanSum, loan) => loanSum + loan.remainingAmount, 0), 0);
  const tagPaidAmount = tagTotalAmount - tagRemainingAmount;
  const tabs = [["all", "Semua"], ["active", "Aktif"], ["paid", "Lunas"], ["overdue", "Jatuh tempo"]];
  const dashboardUrl = (status: string, tag: string) => { const params=new URLSearchParams(); if(status!=="all")params.set("status",status); if(tag!=="all")params.set("tag",tag); const query=params.toString(); return query?`/admin/dashboard?${query}`:"/admin/dashboard"; };

  return <div className="space-y-8">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-primary"><UsersRound className="h-3.5 w-3.5"/>Ringkasan portofolio</div><h1 className="text-3xl font-bold sm:text-4xl">Selamat datang</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Lihat semua peminjam, sisa piutang, dan progres pembayaran dari satu dashboard.</p></div><Button asChild size="lg"><Link href="/admin/borrowers/new"><Plus className="h-4 w-4" />Tambah peminjam</Link></Button></div>
    <DashboardSummary summary={summary} />
    <section className="space-y-4"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Daftar peminjam</h2><p className="mt-1 text-sm text-muted-foreground">{borrowers.length} data ditampilkan</p></div><Filter className="h-4 w-4 text-muted-foreground"/></div><Card className="p-2"><div className="flex gap-1 overflow-x-auto">{tabs.map(([key, label]) => <Link key={key} href={dashboardUrl(key,selectedTag)} className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${filter === key ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{label}</Link>)}</div></Card>{tags.length>0&&<div className="flex items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</span><Link href={dashboardUrl(filter,"all")} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedTag==="all"?"border-primary bg-accent text-accent-foreground":"bg-white text-muted-foreground hover:border-primary/30"}`}>Semua</Link>{tags.map(tag=><Link key={tag} href={dashboardUrl(filter,tag)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedTag===tag?"border-primary bg-accent text-accent-foreground":"bg-white text-muted-foreground hover:border-primary/30"}`}>{tag}</Link>)}</div>}</section>
    {selectedTag !== "all" && <Card className="overflow-hidden border-violet-200 bg-gradient-to-br from-white via-white to-violet-50/80"><CardContent className="p-0"><div className="flex flex-col gap-4 border-b border-violet-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><TagIcon className="h-4 w-4"/></span><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-600">Rincian tag aktif</p><h3 className="mt-0.5 text-lg font-bold">{selectedTag}</h3></div></div><Link href={dashboardUrl(filter,"all")} className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white hover:text-foreground sm:self-auto"><X className="h-3.5 w-3.5"/>Hapus filter tag</Link></div><div className="grid lg:grid-cols-[1.25fr_2fr]"><div className="border-b border-violet-100 p-5 sm:p-6 lg:border-b-0 lg:border-r"><p className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Banknote className="h-4 w-4 text-violet-600"/>Sisa piutang tag ini</p><p className="mt-3 text-3xl font-bold text-violet-700 sm:text-4xl">{formatRupiah(tagRemainingAmount)}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Total sisa seluruh pinjaman dari peminjam dengan tag “{selectedTag}”.</p></div><div className="grid grid-cols-2 divide-x divide-y divide-violet-100 sm:grid-cols-3 sm:divide-y-0"><div className="p-5 sm:p-6"><p className="text-xs font-medium text-muted-foreground">Total pinjaman</p><p className="mt-2 text-lg font-bold">{formatRupiah(tagTotalAmount)}</p></div><div className="p-5 sm:p-6"><p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><CircleCheckBig className="h-3.5 w-3.5 text-emerald-600"/>Sudah dibayar</p><p className="mt-2 text-lg font-bold text-emerald-600">{formatRupiah(tagPaidAmount)}</p></div><div className="col-span-2 p-5 sm:col-span-1 sm:p-6"><p className="text-xs font-medium text-muted-foreground">Cakupan data</p><p className="mt-2 text-lg font-bold">{taggedBorrowers.length} peminjam</p><p className="mt-1 text-xs text-muted-foreground">{tagLoanCount} pinjaman</p></div></div></div></CardContent></Card>}
    {borrowers.length === 0 ? <Card><CardContent className="flex flex-col items-center px-6 py-16 text-center"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Inbox className="h-6 w-6"/></span><h3 className="font-bold">Belum ada data</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Tidak ada peminjam pada filter ini. Coba filter lain atau tambahkan peminjam baru.</p></CardContent></Card> : <>
      <div className="grid gap-4 md:hidden">{borrowers.map(borrower => <BorrowerCard key={borrower.id} borrower={borrower} />)}</div>
      <Card className="hidden overflow-hidden md:block"><CardContent className="p-0"><Table><TableHeader className="bg-muted/50"><TableRow><TableHead className="pl-6">Peminjam</TableHead><TableHead>Pinjaman</TableHead><TableHead>Total gabungan</TableHead><TableHead>Sisa gabungan</TableHead><TableHead>Status</TableHead><TableHead className="pr-6 text-right">Aksi</TableHead></TableRow></TableHeader><TableBody>{borrowers.map(borrower => {
        const status = calculateBorrowerStatus(borrower.loans);
        const total = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
        const remaining = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
        const latest = borrower.loans[0];
        return <TableRow key={borrower.id}><TableCell className="pl-6"><p className="font-semibold">{borrower.name}</p>{borrower.tags.length>0&&<div className="mt-1.5 flex flex-wrap gap-1">{borrower.tags.map(tag=><span key={tag} className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">{tag}</span>)}</div>}</TableCell><TableCell><p className="font-medium">{borrower.loans.length} pinjaman</p>{latest && <p className="mt-0.5 text-xs text-muted-foreground">Terbaru · {formatLoanDuration(latest.startDate)}</p>}</TableCell><TableCell>{formatRupiah(total)}</TableCell><TableCell className="font-bold">{formatRupiah(remaining)}</TableCell><TableCell><Badge variant={status === "paid" ? "paid" : status === "overdue" ? "overdue" : "default"}>{statusLabel(status)}</Badge></TableCell><TableCell className="pr-6"><div className="flex justify-end gap-2"><Button asChild size="sm" variant="outline"><Link href={`/admin/borrowers/${borrower.id}`}>Lihat detail</Link></Button><ShareButton compact borrowerName={borrower.name} shareToken={borrower.shareToken} phoneNumber={borrower.phone} /></div></TableCell></TableRow>;
      })}</TableBody></Table></CardContent></Card>
    </>}
  </div>;
}
