"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { checkOnboardingName, getBorrowerNameSuggestions, verifyOnboardingAccess } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<"name" | "code">("name");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSequence = useRef(0);

  function changeName(value: string) {
    setName(value); setError("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const sequence = ++searchSequence.current;
    if (value.trim().length < 3) { setSuggestions([]); setSearching(false); return; }
    setSearching(true);
    debounceTimer.current = setTimeout(async () => {
      const results = await getBorrowerNameSuggestions(value);
      if (sequence === searchSequence.current) { setSuggestions(results); setSearching(false); }
    }, 350);
  }

  function selectSuggestion(value: string) {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    searchSequence.current += 1;
    setName(value); setSuggestions([]); setSearching(false); setError("");
  }

  async function submitName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    searchSequence.current += 1; setSuggestions([]); setSearching(false);
    setLoading(true); setError("");
    const result = await checkOnboardingName(name);
    setLoading(false);
    if (result.ok) setStep("code");
    else setError(result.error || "Nama atau kode verifikasi tidak cocok.");
  }

  async function submitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("verifyCode") || "");
    setLoading(true); setError("");
    const result = await verifyOnboardingAccess(name, code);
    setLoading(false);
    if (result.ok && result.shareToken) router.replace(`/p/${result.shareToken}`);
    else setError(result.error || "Nama atau kode verifikasi tidak cocok.");
  }

  if (step === "name") return <form onSubmit={submitName} className="space-y-5">
    <div className="space-y-2"><Label htmlFor="borrower-name">Nama lengkap</Label><div className="relative"><Input id="borrower-name" value={name} onChange={event => changeName(event.target.value)} autoComplete="off" aria-autocomplete="list" aria-controls="borrower-suggestions" aria-expanded={suggestions.length > 0} required placeholder="Ketik minimal 3 karakter" />{searching&&<Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground"/>}{suggestions.length>0&&<div id="borrower-suggestions" role="listbox" aria-label="Saran nama peminjam" className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border bg-white py-1 shadow-lg">{suggestions.map(suggestion=><button key={suggestion} type="button" role="option" aria-selected={name===suggestion} onClick={()=>selectSuggestion(suggestion)} className="block w-full px-3 py-2.5 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none">{suggestion}</button>)}</div>}</div><p className="text-xs text-muted-foreground">Saran muncul otomatis setelah Anda berhenti mengetik.</p></div>
    {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Button className="w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}{loading ? "Mencari..." : "Lanjutkan"}</Button>
  </form>;

  return <form onSubmit={submitCode} className="space-y-5">
    <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800"><ShieldCheck className="mr-2 inline h-4 w-4" />Masukkan kode 6 karakter huruf dan angka yang diberikan pemberi pinjaman.</div>
    <div className="space-y-2"><Label htmlFor="verify-code">Kode verifikasi</Label><Input id="verify-code" name="verifyCode" type="password" inputMode="text" pattern="[A-Za-z0-9]{6}" maxLength={6} autoCapitalize="characters" onInput={event=>{event.currentTarget.value=event.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g,"")}} autoComplete="one-time-code" required autoFocus className="text-center font-mono text-2xl uppercase tracking-[.35em]" placeholder="••••••" /></div>
    {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="flex gap-2"><Button type="button" variant="outline" className="flex-1" onClick={() => { setStep("name"); setError(""); }}><ArrowLeft className="h-4 w-4" />Ganti nama</Button><Button className="flex-1" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{loading ? "Memeriksa..." : "Lihat status"}</Button></div>
  </form>;
}
