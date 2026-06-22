import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound(){return <main className="flex min-h-screen items-center justify-center p-4"><div className="max-w-md text-center"><CircleX className="mx-auto h-14 w-14 text-red-400"/><h1 className="mt-5 text-2xl font-bold">Link tidak valid</h1><p className="mt-2 text-muted-foreground">Data pinjaman tidak ditemukan. Pastikan link yang Anda buka sudah benar.</p><Button asChild variant="outline" className="mt-6"><Link href="/">Kembali</Link></Button></div></main>}
