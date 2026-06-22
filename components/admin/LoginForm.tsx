"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, LogIn } from "lucide-react";
import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const form = new FormData(e.currentTarget);
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, String(form.get("email")), String(form.get("password")));
      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error);
      router.replace("/admin/dashboard"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Login gagal."); } finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="space-y-5">
    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required placeholder="pemberipinjaman@email.com" /></div>
    <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {error && <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
    <Button className="w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}{loading ? "Memproses..." : "Masuk"}</Button>
  </form>;
}
