"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TagInput({ name = "tags", defaultValue = [] }: { name?: string; defaultValue?: string[] }) {
  const [tags, setTags] = useState(defaultValue);
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = draft.trim().replace(/\s+/g, " ").slice(0, 30);
    if (!tag || tags.some(item => item.toLocaleLowerCase("id-ID") === tag.toLocaleLowerCase("id-ID")) || tags.length >= 10) { setDraft(""); return; }
    setTags(items => [...items, tag]); setDraft("");
  }

  return <div className="space-y-2">
    <input type="hidden" name={name} value={JSON.stringify(tags)} />
    <div className="flex gap-2"><Input value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(); } }} placeholder="Ketik tag, lalu Enter" maxLength={30} /><Button type="button" variant="outline" size="icon" onClick={addTag} disabled={!draft.trim() || tags.length >= 10} aria-label="Tambah tag"><Plus className="h-4 w-4" /></Button></div>
    {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map(tag => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">{tag}<button type="button" onClick={() => setTags(items => items.filter(item => item !== tag))} aria-label={`Hapus tag ${tag}`} className="rounded-full hover:bg-violet-500/20"><X className="h-3 w-3" /></button></span>)}</div>}
    <p className="text-xs text-muted-foreground">Maksimal 10 tag. Tekan Enter atau koma untuk menambahkan.</p>
  </div>;
}
