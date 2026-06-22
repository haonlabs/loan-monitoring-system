"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function LogoutButton({className,compact=false}:{className?:string;compact?:boolean}) { const router=useRouter(); return <Button variant="ghost" size={compact?"icon":"sm"} className={cn(className)} aria-label="Keluar" onClick={async()=>{await fetch("/api/session",{method:"DELETE"});router.replace("/");router.refresh();}}><LogOut className="h-4 w-4" />{!compact&&"Keluar"}</Button>; }
