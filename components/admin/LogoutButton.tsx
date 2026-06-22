"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
export function LogoutButton() { const router=useRouter(); return <Button variant="ghost" size="sm" onClick={async()=>{await fetch("/api/session",{method:"DELETE"});router.replace("/");router.refresh();}}><LogOut className="h-4 w-4" />Keluar</Button>; }
