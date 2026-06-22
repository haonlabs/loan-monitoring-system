"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { normalizeBorrowerName, parseRupiah } from "@/lib/utils";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function tagsFrom(form: FormData): string[] {
  try {
    const values = JSON.parse(String(form.get("tags") || "[]"));
    if (!Array.isArray(values)) return [];
    const unique = new Map<string, string>();
    for (const value of values) {
      const tag = String(value).trim().replace(/\s+/g, " ").slice(0, 30);
      if (tag) unique.set(tag.toLocaleLowerCase("id-ID"), tag);
      if (unique.size >= 10) break;
    }
    return Array.from(unique.values());
  } catch { return []; }
}

async function syncBorrowerActive(borrowerId: string) {
  const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
  const outstanding = await borrowerRef.collection("loans").where("remainingAmount", ">", 0).limit(1).get();
  await borrowerRef.update({ isActive: !outstanding.empty });
}

const proofTypes: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "application/pdf":"pdf" };

async function saveTransferProof(borrowerId:string,loanId:string,uploaderRole:"borrower"|"lender",form:FormData):Promise<ActionResult>{
  const upload=form.get("file");
  if(!(upload instanceof File)||upload.size===0)return{ok:false,error:"Pilih file bukti transfer."};
  if(!proofTypes[upload.type])return{ok:false,error:"Format file harus JPG, PNG, WebP, atau PDF."};
  if(upload.size>3*1024*1024)return{ok:false,error:"Ukuran file maksimal 3 MB."};
  const borrowerRef=adminDb.collection("borrowers").doc(borrowerId);
  const loanRef=borrowerRef.collection("loans").doc(loanId);
  if(!(await loanRef.get()).exists)return{ok:false,error:"Pinjaman tidak ditemukan."};
  const proofRef=borrowerRef.collection("proofs").doc();
  try{
    const safeName=upload.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100)||`bukti.${proofTypes[upload.type]}`;
    const blob=await put(`borrowers/${borrowerId}/loans/${loanId}/proofs/${safeName}`,upload,{access:"private",addRandomSuffix:true,cacheControlMaxAge:300});
    try{await proofRef.set({loanId,originalName:upload.name.slice(0,120),contentType:upload.type,size:upload.size,blobPathname:blob.pathname,caption:String(form.get("caption")||"").trim().slice(0,200),uploaderRole,uploadedAt:FieldValue.serverTimestamp()});}catch(error){await del(blob.pathname).catch(()=>undefined);throw error;}
    return{ok:true,id:proofRef.id};
  }catch(error){return{ok:false,error:error instanceof Error?error.message:"Gagal mengunggah bukti transfer."};}
}

export async function uploadLenderProof(borrowerId:string,loanId:string,form:FormData):Promise<ActionResult>{
  await requireAdmin();
  const result=await saveTransferProof(borrowerId,loanId,"lender",form);
  if(result.ok){const borrower=await adminDb.collection("borrowers").doc(borrowerId).get();revalidatePath(`/admin/borrowers/${borrowerId}`);const token=borrower.data()?.shareToken;if(token)revalidatePath(`/p/${token}`);}
  return result;
}

export async function uploadBorrowerProof(shareToken:string,loanId:string,form:FormData):Promise<ActionResult>{
  const borrowerSnap=await adminDb.collection("borrowers").where("shareToken","==",shareToken).limit(1).get();
  if(borrowerSnap.empty)return{ok:false,error:"Akses tidak valid."};
  const borrowerId=borrowerSnap.docs[0].id;
  const result=await saveTransferProof(borrowerId,loanId,"borrower",form);
  if(result.ok){revalidatePath(`/p/${shareToken}`);revalidatePath(`/admin/borrowers/${borrowerId}`);}
  return result;
}

export async function createBorrower(form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const principal = parseRupiah(form.get("principal"));
  const interest = Number(form.get("interest") || 0);
  const verifyCode = String(form.get("verifyCode") || "").trim();
  const startDate = String(form.get("startDate") || "");
  const dueDate = String(form.get("dueDate") || "");
  if (!name || principal <= 0 || !startDate) return { ok: false, error: "Lengkapi semua data wajib." };
  if (!/^\d{4}$/.test(verifyCode)) return { ok: false, error: "Kode verifikasi harus terdiri dari 4 digit angka." };
  if (dueDate && new Date(dueDate) < new Date(startDate)) return { ok: false, error: "Tanggal jatuh tempo harus setelah tanggal mulai." };
  try {
    const borrowerRef = adminDb.collection("borrowers").doc();
    const loanRef = borrowerRef.collection("loans").doc();
    const totalAmount = Math.round(principal + principal * interest / 100);
    const batch = adminDb.batch();
    batch.set(borrowerRef, {
      name, nameNormalized: normalizeBorrowerName(name), phone: String(form.get("phone") || "").trim(), shareToken: nanoid(8), verifyCode, tags: tagsFrom(form), isActive: true,
      notes: String(form.get("notes") || "").trim(), createdAt: FieldValue.serverTimestamp()
    });
    batch.set(loanRef, {
      principal, interest, totalAmount, remainingAmount: totalAmount,
      startDate: Timestamp.fromDate(new Date(`${startDate}T00:00:00+07:00`)), dueDate: dueDate ? Timestamp.fromDate(new Date(`${dueDate}T00:00:00+07:00`)) : null,
      status: "active", description: String(form.get("description") || "").trim(), createdAt: FieldValue.serverTimestamp()
    });
    await batch.commit();
    revalidatePath("/admin/dashboard");
    return { ok: true, id: borrowerRef.id };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan peminjam." }; }
}

export async function createLoan(borrowerId: string, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const principal = parseRupiah(form.get("principal"));
  const interest = Number(form.get("interest") || 0);
  const startDate = String(form.get("startDate") || "");
  const dueDate = String(form.get("dueDate") || "");
  if (principal <= 0 || !startDate) return { ok: false, error: "Jumlah dan tanggal mulai wajib diisi." };
  if (interest < 0) return { ok: false, error: "Bunga tidak boleh negatif." };
  if (dueDate && new Date(dueDate) < new Date(startDate)) return { ok: false, error: "Tanggal jatuh tempo harus setelah tanggal mulai." };
  try {
    const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
    if (!(await borrowerRef.get()).exists) return { ok: false, error: "Peminjam tidak ditemukan." };
    const loanRef = borrowerRef.collection("loans").doc();
    const totalAmount = Math.round(principal + principal * interest / 100);
    const batch = adminDb.batch();
    batch.set(loanRef, {
      principal, interest, totalAmount, remainingAmount: totalAmount,
      startDate: Timestamp.fromDate(new Date(`${startDate}T00:00:00+07:00`)),
      dueDate: dueDate ? Timestamp.fromDate(new Date(`${dueDate}T00:00:00+07:00`)) : null,
      status: "active", description: String(form.get("description") || "").trim(), createdAt: FieldValue.serverTimestamp()
    });
    batch.update(borrowerRef, { isActive: true });
    await batch.commit();
    revalidatePath(`/admin/borrowers/${borrowerId}`); revalidatePath("/admin/dashboard");
    return { ok: true, id: loanRef.id };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal menambah pinjaman." }; }
}

export async function recordPayment(borrowerId: string, loanId: string, form: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const amount = parseRupiah(form.get("amount"));
  const paidAt = String(form.get("paidAt") || "");
  if (amount <= 0 || !paidAt) return { ok: false, error: "Jumlah dan tanggal pembayaran wajib diisi." };
  try {
    const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
    const loanRef = borrowerRef.collection("loans").doc(loanId);
    await adminDb.runTransaction(async tx => {
      const current = await tx.get(loanRef);
      const remaining = Number(current.data()?.remainingAmount || 0);
      if (amount > remaining) throw new Error("Pembayaran tidak boleh melebihi sisa hutang.");
      const remainingAfter = remaining - amount;
      const paymentRef = borrowerRef.collection("payments").doc();
      tx.update(loanRef, { remainingAmount: remainingAfter, status: remainingAfter === 0 ? "paid" : current.data()?.status });
      tx.set(paymentRef, { loanId: loanRef.id, amount, paidAt: Timestamp.fromDate(new Date(`${paidAt}T12:00:00+07:00`)), note: String(form.get("note") || "").trim(), remainingAfter, recordedBy: admin.uid });
    });
    await syncBorrowerActive(borrowerId);
    revalidatePath(`/admin/borrowers/${borrowerId}`); revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal mencatat pembayaran." }; }
}

export async function deletePayment(borrowerId: string, paymentId: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
    const paymentRef = borrowerRef.collection("payments").doc(paymentId);
    const payment = await paymentRef.get();
    if (!payment.exists) return { ok: false, error: "Pembayaran tidak ditemukan." };
    const loanRef = borrowerRef.collection("loans").doc(payment.data()!.loanId);
    await adminDb.runTransaction(async tx => {
      const loan = await tx.get(loanRef);
      const restored = Number(loan.data()?.remainingAmount || 0) + Number(payment.data()?.amount || 0);
      tx.update(loanRef, { remainingAmount: restored, status: "active" });
      tx.update(borrowerRef, { isActive: true });
      tx.delete(paymentRef);
    });
    revalidatePath(`/admin/borrowers/${borrowerId}`); revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus pembayaran." }; }
}

export async function markLoanPaid(borrowerId: string, loanId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
    const loanRef = borrowerRef.collection("loans").doc(loanId);
    await adminDb.runTransaction(async tx => {
      const loan = await tx.get(loanRef);
      const remaining = Number(loan.data()?.remainingAmount || 0);
      if (remaining <= 0) return;
      const paymentRef = borrowerRef.collection("payments").doc();
      tx.update(loanRef, { remainingAmount: 0, status: "paid" });
      tx.set(paymentRef, {
        loanId: loanRef.id,
        amount: remaining,
        paidAt: Timestamp.now(),
        note: "Ditandai lunas oleh pemberi pinjaman",
        remainingAfter: 0,
        recordedBy: admin.uid
      });
    });
    await syncBorrowerActive(borrowerId);
    revalidatePath(`/admin/borrowers/${borrowerId}`); revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal menandai pinjaman lunas." }; }
}

export async function deleteBorrower(borrowerId: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const borrowerRef = adminDb.collection("borrowers").doc(borrowerId);
    if (!(await borrowerRef.get()).exists) return { ok: false, error: "Peminjam tidak ditemukan." };
    const proofs=await borrowerRef.collection("proofs").get();
    const blobPaths=proofs.docs.map(proof=>String(proof.data().blobPathname||"")).filter(Boolean);
    await adminDb.recursiveDelete(borrowerRef);
    if(blobPaths.length)await del(blobPaths).catch(()=>undefined);
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus peminjam." }; }
}

export async function updateBorrower(borrowerId: string, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const verifyCode = String(form.get("verifyCode") || "").trim();
  if (!name) return { ok: false, error: "Nama peminjam wajib diisi." };
  if (!/^\d{4}$/.test(verifyCode)) return { ok: false, error: "Kode verifikasi harus terdiri dari 4 digit angka." };
  try {
    await adminDb.collection("borrowers").doc(borrowerId).update({
      name,
      nameNormalized: normalizeBorrowerName(name),
      phone: String(form.get("phone") || "").trim(),
      notes: String(form.get("notes") || "").trim(),
      verifyCode,
      tags: tagsFrom(form)
    });
    revalidatePath(`/admin/borrowers/${borrowerId}`); revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Gagal mengubah data peminjam." }; }
}

const onboardingError = "Nama atau kode verifikasi tidak cocok.";

export async function getBorrowerNameSuggestions(query: string): Promise<string[]> {
  const normalized = normalizeBorrowerName(query);
  if (normalized.length < 3) return [];
  try {
    const snap = await adminDb.collection("borrowers")
      .orderBy("nameNormalized")
      .startAt(normalized)
      .endAt(`${normalized}\uf8ff`)
      .limit(5)
      .get();
    return Array.from(new Set(snap.docs.map(doc => String(doc.data().name || "")).filter(Boolean)));
  } catch { return []; }
}

export async function checkOnboardingName(name: string): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizeBorrowerName(name);
  if (!normalized) return { ok: false, error: onboardingError };
  try {
    const snap = await adminDb.collection("borrowers").where("nameNormalized", "==", normalized).limit(1).get();
    return snap.empty ? { ok: false, error: onboardingError } : { ok: true };
  } catch { return { ok: false, error: onboardingError }; }
}

export async function verifyOnboardingAccess(name: string, code: string): Promise<{ ok: boolean; shareToken?: string; error?: string }> {
  const normalized = normalizeBorrowerName(name);
  if (!normalized || !/^\d{4}$/.test(code)) return { ok: false, error: onboardingError };
  try {
    const snap = await adminDb.collection("borrowers").where("nameNormalized", "==", normalized).get();
    const borrower = snap.docs.find(doc => doc.data().verifyCode === code);
    if (!borrower) return { ok: false, error: onboardingError };
    return { ok: true, shareToken: String(borrower.data().shareToken) };
  } catch { return { ok: false, error: onboardingError }; }
}
