import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Pantau Pinjaman", description: "Monitoring pinjaman pribadi yang rapi dan aman" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
