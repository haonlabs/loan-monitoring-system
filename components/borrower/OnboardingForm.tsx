"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Search, ShieldCheck } from "lucide-react";
import { checkOnboardingName, getBorrowerNameSuggestions, verifyOnboardingAccess } from "@/app/actions";

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

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

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
    else setError(result.error || "Nama tidak ditemukan.");
  }

  async function submitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("verifyCode") || "");
    setLoading(true); setError("");
    const result = await verifyOnboardingAccess(name, code);
    setLoading(false);
    if (result.ok && result.shareToken) router.replace(`/p/${result.shareToken}`);
    else setError(result.error || "Kode verifikasi tidak sesuai.");
  }

  return <div className="space-y-6">
    <div className="flex items-center gap-2"><div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${step === "name" ? "bg-indigo-500 text-white" : "bg-indigo-500/20 text-indigo-300"}`}>1</div><div className={`h-px flex-1 transition ${step === "code" ? "bg-indigo-500" : "bg-white/10"}`}/><div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${step === "code" ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-500"}`}>2</div></div>

    {step === "name" ? <form onSubmit={submitName} className="space-y-5">
      <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"/><input id="borrower-name" value={name} onChange={event => changeName(event.target.value)} autoComplete="off" aria-autocomplete="list" aria-controls="borrower-suggestions" aria-expanded={suggestions.length > 0} required placeholder="Ketik nama lengkap..." className="flex h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-base text-white shadow-sm transition-colors placeholder:text-slate-500 focus-visible:border-indigo-400/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400/30"/>{searching && <Loader2 className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-slate-400"/>}{suggestions.length > 0 && <div id="borrower-suggestions" role="listbox" aria-label="Saran nama peminjam" className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 py-1.5 shadow-2xl">{suggestions.map(suggestion => <button key={suggestion} type="button" role="option" aria-selected={name === suggestion} onClick={() => selectSuggestion(suggestion)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white focus:bg-white/5 focus:outline-none"><Search className="h-3.5 w-3.5 shrink-0 text-slate-500"/>{suggestion}</button>)}</div>}</div>

      <div className="rounded-xl border border-white/5 bg-white/[.04] p-3 text-xs leading-5 text-slate-500">Saran nama muncul otomatis setelah kamu berhenti mengetik.</div>

      {error && <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <ArrowRight className="h-4 w-4"/>}{loading ? "Mencari..." : "Lanjutkan"}</button>
    </form> : <form onSubmit={submitCode} className="space-y-5">
      <div className="rounded-xl border border-indigo-400/10 bg-indigo-400/5 p-4 text-sm leading-6 text-indigo-300"><ShieldCheck className="mr-2 inline h-4 w-4"/>Masukkan kode 6 karakter yang diberikan pemberi pinjaman.</div>

      <div><label htmlFor="verify-code" className="mb-2 block text-sm font-medium text-slate-300">Kode verifikasi</label><input id="verify-code" name="verifyCode" type="password" inputMode="text" pattern="[A-Za-z0-9]{6}" maxLength={6} autoCapitalize="characters" onInput={event => { event.currentTarget.value = event.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); }} autoComplete="one-time-code" required autoFocus className="flex h-14 w-full rounded-xl border border-white/10 bg-white/5 text-center font-mono text-2xl uppercase tracking-[.35em] text-white shadow-sm transition-colors placeholder:text-slate-600 focus-visible:border-indigo-400/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400/30" placeholder="••••••"/></div>

      {error && <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <div className="flex gap-3"><button type="button" onClick={() => { setStep("name"); setError(""); }} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"><ArrowLeft className="h-4 w-4"/>Ganti nama</button><button type="submit" disabled={loading} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <ShieldCheck className="h-4 w-4"/>}{loading ? "Memeriksa..." : "Lihat status"}</button></div>
    </form>}
  </div>;
}
