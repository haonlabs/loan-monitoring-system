import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationLoading } from "@/components/NavigationLoading";
import "./globals.css";

export const metadata: Metadata = { title: "tagihanku", description: "Monitoring pinjaman pribadi yang rapi dan aman" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><Suspense fallback={null}><NavigationLoading /></Suspense>{children}</body></html>;
}
