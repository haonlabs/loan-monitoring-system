import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaginationLinks({ currentPage, totalPages, getHref }: { currentPage: number; totalPages: number; getHref: (page: number) => string }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Pagination"><p className="text-sm text-muted-foreground">Halaman {currentPage} dari {totalPages}</p><div className="flex flex-wrap gap-1"><Button asChild variant="outline" size="sm" className={currentPage===1?"pointer-events-none opacity-50":""}><Link href={getHref(currentPage-1)} aria-label="Halaman sebelumnya"><ChevronLeft className="h-4 w-4"/>Sebelumnya</Link></Button>{pages.map(page=><Button key={page} asChild variant={page===currentPage?"default":"outline"} size="sm" className="min-w-9 px-3"><Link href={getHref(page)} aria-current={page===currentPage?"page":undefined}>{page}</Link></Button>)}<Button asChild variant="outline" size="sm" className={currentPage===totalPages?"pointer-events-none opacity-50":""}><Link href={getHref(currentPage+1)} aria-label="Halaman berikutnya">Berikutnya<ChevronRight className="h-4 w-4"/></Link></Button></div></nav>;
}
