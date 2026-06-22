import "server-only";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import type { Borrower, BorrowerWithLoans, Loan, Payment, TransferProof } from "@/types";

const date = (value: any): Date => value?.toDate ? value.toDate() : new Date(value);
const nullableDate = (value: any): Date | null => value ? date(value) : null;
const borrowerFrom = (d: QueryDocumentSnapshot<DocumentData>): Borrower => { const data=d.data(); return { id:d.id,...data,tags:Array.isArray(data.tags)?data.tags:[],createdAt:date(data.createdAt) } as Borrower; };
const loanFrom = (d: QueryDocumentSnapshot<DocumentData>, borrowerId: string): Loan => ({ id: d.id, borrowerId, ...d.data(), startDate: date(d.data().startDate), dueDate: nullableDate(d.data().dueDate), createdAt: date(d.data().createdAt) } as Loan);
const paymentFrom = (d: QueryDocumentSnapshot<DocumentData>): Payment => ({ id: d.id, ...d.data(), paidAt: date(d.data().paidAt) } as Payment);
const proofFrom = (d: QueryDocumentSnapshot<DocumentData>): TransferProof => ({ id:d.id,...d.data(),uploadedAt:date(d.data().uploadedAt) } as TransferProof);

export async function getBorrower(id: string): Promise<BorrowerWithLoans | null> {
  const ref = adminDb.collection("borrowers").doc(id);
  const [borrower, loans, payments, proofs] = await Promise.all([
    ref.get(), ref.collection("loans").orderBy("createdAt", "desc").get(), ref.collection("payments").orderBy("paidAt", "desc").get(), ref.collection("proofs").orderBy("uploadedAt", "desc").get()
  ]);
  if (!borrower.exists) return null;
  const data = borrower.data()!;
  const b = { id: borrower.id, ...data, tags: Array.isArray(data.tags) ? data.tags : [], createdAt: date(data.createdAt) } as Borrower;
  return { ...b, loans: loans.docs.map(doc => loanFrom(doc, id)), payments: payments.docs.map(paymentFrom), proofs: proofs.docs.map(proofFrom) };
}

export async function getAllBorrowers(): Promise<BorrowerWithLoans[]> {
  const snap = await adminDb.collection("borrowers").orderBy("createdAt", "desc").get();
  return Promise.all(snap.docs.map(async d => {
    const b = borrowerFrom(d);
    const loanSnap = await d.ref.collection("loans").orderBy("createdAt", "desc").get();
    return { ...b, loans: loanSnap.docs.map(doc => loanFrom(doc, b.id)), payments: [], proofs: [] };
  }));
}

export async function getBorrowerByToken(token: string): Promise<BorrowerWithLoans | null> {
  const snap = await adminDb.collection("borrowers").where("shareToken", "==", token).limit(1).get();
  return snap.empty ? null : getBorrower(snap.docs[0].id);
}
