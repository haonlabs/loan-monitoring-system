import { addMonths, addYears, differenceInCalendarDays, differenceInMonths, differenceInYears, startOfDay } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Loan, LoanStatus } from "@/types";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(date);
}

export function calculateLoanStatus(loan: Loan): LoanStatus {
  if (loan.remainingAmount <= 0) return "paid";
  if (!loan.dueDate) return "active";
  return loan.dueDate.getTime() < new Date().setHours(0, 0, 0, 0) ? "overdue" : "active";
}

export function calculatePaidPercentage(loan: Loan): number {
  if (loan.totalAmount <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round(((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100)));
}

export function daysUntilDue(dueDate: Date): number { return differenceInCalendarDays(dueDate, new Date()); }

export function formatLoanDuration(startDate: Date, endDate = new Date()): string {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  if (start.getTime() > end.getTime()) return "Belum dimulai";
  const years = differenceInYears(end, start);
  const afterYears = addYears(start, years);
  const months = differenceInMonths(end, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInCalendarDays(end, afterMonths);
  if (years > 0) return `${years} tahun${months > 0 ? ` ${months} bulan` : ""}`;
  if (months > 0) return `${months} bulan${days > 0 ? ` ${days} hari` : ""}`;
  return `${days} hari`;
}

export function generateShareUrl(shareToken: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  return `${base.replace(/\/$/, "")}/p/${shareToken}`;
}

export function generateWAMessage(borrowerName: string, shareToken: string): string {
  return `Halo ${borrowerName}, berikut link untuk melihat status pinjamanmu:\n${generateShareUrl(shareToken)}\n\nKamu bisa melihat detail pinjaman dan riwayat pembayaran di sana.`;
}

export function parseRupiah(value: FormDataEntryValue | null): number {
  return Number(String(value || "").replace(/[^0-9]/g, ""));
}

export function statusLabel(status: LoanStatus) {
  return status === "paid" ? "Lunas" : status === "overdue" ? "Jatuh tempo" : "Aktif";
}

export function calculateBorrowerStatus(loans: Loan[]): LoanStatus {
  if (!loans.length || loans.every(loan => calculateLoanStatus(loan) === "paid")) return "paid";
  if (loans.some(loan => calculateLoanStatus(loan) === "overdue")) return "overdue";
  return "active";
}

export function normalizeBorrowerName(name: string): string {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}
