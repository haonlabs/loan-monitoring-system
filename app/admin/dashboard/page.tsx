import Link from "next/link";
import { Plus } from "lucide-react";
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
  const tabs = [["all", "Semua"], ["active", "Aktif"], ["paid", "Lunas"], ["overdue", "Jatuh tempo"]];
  const dashboardUrl = (status: string, tag: string) => { const params=new URLSearchParams(); if(status!=="all")params.set("status",status); if(tag!=="all")params.set("tag",tag); const query=params.toString(); return query?`/admin/dashboard?${query}`:"/admin/dashboard"; };

  return <div className="space-y-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1><p className="mt-1 text-muted-foreground">Satu peminjam dapat memiliki beberapa pinjaman.</p></div><Button asChild><Link href="/admin/borrowers/new"><Plus className="h-4 w-4" />Tambah Peminjam</Link></Button></div>
    <DashboardSummary summary={summary} />
    <div className="space-y-3"><div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1">{tabs.map(([key, label]) => <Link key={key} href={dashboardUrl(key,selectedTag)} className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${filter === key ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"}`}>{label}</Link>)}</div>{tags.length>0&&<div className="flex items-center gap-2 overflow-x-auto"><span className="shrink-0 text-sm font-medium text-muted-foreground">Tag:</span><Link href={dashboardUrl(filter,"all")} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${selectedTag==="all"?"bg-violet-600 text-white":"border bg-white hover:bg-violet-50"}`}>Semua tag</Link>{tags.map(tag=><Link key={tag} href={dashboardUrl(filter,tag)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${selectedTag===tag?"bg-violet-600 text-white":"border bg-white hover:bg-violet-50"}`}>{tag}</Link>)}</div>}</div>
    {borrowers.length === 0 ? <Card><CardContent className="p-12 text-center text-muted-foreground">Belum ada data pada kategori ini.</CardContent></Card> : <>
      <div className="grid gap-4 md:hidden">{borrowers.map(borrower => <BorrowerCard key={borrower.id} borrower={borrower} />)}</div>
      <Card className="hidden md:block"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Peminjam</TableHead><TableHead>Pinjaman</TableHead><TableHead>Total gabungan</TableHead><TableHead>Sisa gabungan</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>{borrowers.map(borrower => {
        const status = calculateBorrowerStatus(borrower.loans);
        const total = borrower.loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
        const remaining = borrower.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
        const latest = borrower.loans[0];
        return <TableRow key={borrower.id}><TableCell><p className="font-medium">{borrower.name}</p>{borrower.tags.length>0&&<div className="mt-1 flex flex-wrap gap-1">{borrower.tags.map(tag=><span key={tag} className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">{tag}</span>)}</div>}</TableCell><TableCell><p className="font-medium">{borrower.loans.length} pinjaman</p>{latest && <p className="text-xs text-muted-foreground">Terbaru berjalan {formatLoanDuration(latest.startDate)}</p>}</TableCell><TableCell>{formatRupiah(total)}</TableCell><TableCell className="font-semibold">{formatRupiah(remaining)}</TableCell><TableCell><Badge variant={status === "paid" ? "paid" : status === "overdue" ? "overdue" : "default"}>{statusLabel(status)}</Badge></TableCell><TableCell><div className="flex gap-2"><Button asChild size="sm"><Link href={`/admin/borrowers/${borrower.id}`}>Lihat Detail</Link></Button><ShareButton compact borrowerName={borrower.name} shareToken={borrower.shareToken} phoneNumber={borrower.phone} /></div></TableCell></TableRow>;
      })}</TableBody></Table></CardContent></Card>
    </>}
  </div>;
}
