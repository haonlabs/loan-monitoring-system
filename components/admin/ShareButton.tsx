"use client";
import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { generateShareUrl, generateWAMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ShareButtonProps { borrowerName: string; shareToken: string; phoneNumber?: string; compact?: boolean }
export function ShareButton({ borrowerName, shareToken, phoneNumber, compact }: ShareButtonProps) {
  const [copied,setCopied]=useState(false); const url=generateShareUrl(shareToken);
  async function copy() { try { await navigator.clipboard.writeText(url); } catch { const el=document.createElement("textarea");el.value=url;document.body.appendChild(el);el.select();document.execCommand("copy");el.remove(); } setCopied(true);setTimeout(()=>setCopied(false),2000); }
  function whatsapp() { const phone=phoneNumber ? `62${phoneNumber.replace(/\D/g,"").replace(/^0/,"")}` : ""; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(generateWAMessage(borrowerName,shareToken))}`,"_blank","noopener,noreferrer"); }
  return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size={compact?"sm":"default"} onClick={copy}>{copied?<Check className="h-4 w-4 text-emerald-600"/>:<Copy className="h-4 w-4"/>}{copied?"Tersalin!":compact?"Salin":"Salin Link"}</Button><Button type="button" variant="outline" size={compact?"sm":"default"} onClick={whatsapp}><MessageCircle className="h-4 w-4 text-emerald-600" />{compact?"WhatsApp":"Kirim via WhatsApp"}</Button></div>;
}
