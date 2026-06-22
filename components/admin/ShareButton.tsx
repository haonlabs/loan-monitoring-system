"use client";
import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { generateShareUrl, generateWAMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ShareButtonProps { borrowerName: string; shareToken: string; verifyCode?: string; phoneNumber?: string; compact?: boolean }
export function ShareButton({ borrowerName, shareToken, verifyCode, phoneNumber, compact }: ShareButtonProps) {
  const [copied,setCopied]=useState(false); const message=generateWAMessage(borrowerName,shareToken,verifyCode);
  async function copy() { try { await navigator.clipboard.writeText(message); } catch { const el=document.createElement("textarea");el.value=message;document.body.appendChild(el);el.select();document.execCommand("copy");el.remove(); } setCopied(true);setTimeout(()=>setCopied(false),2000); }
  function whatsapp() { const phone=phoneNumber ? `62${phoneNumber.replace(/\D/g,"").replace(/^0/,"")}` : ""; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer"); }
  return <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" size={compact?"sm":"default"} onClick={copy}>{copied?<Check className="h-4 w-4 text-emerald-600"/>:<Copy className="h-4 w-4"/>}{copied?"Tersalin!":compact?"Salin":"Salin Pesan"}</Button><Button type="button" variant="outline" size={compact?"sm":"default"} onClick={whatsapp}><MessageCircle className="h-4 w-4 text-emerald-600" />{compact?"WhatsApp":"Kirim via WhatsApp"}</Button></div>;
}
