"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, X } from "lucide-react";
import { updateBorrower } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/admin/TagInput";
export function EditBorrowerForm({borrower}:{borrower:{id:string;name:string;phone:string;notes:string;tags:string[]}}){const router=useRouter();const[open,setOpen]=useState(false);const[loading,setLoading]=useState(false);const[error,setError]=useState("");if(!open)return <Button variant="outline" onClick={()=>setOpen(true)}><Pencil className="h-4 w-4"/>Edit info</Button>;async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);const r=await updateBorrower(borrower.id,new FormData(e.currentTarget));setLoading(false);if(r.ok){setOpen(false);router.refresh()}else setError(r.error)}return <form onSubmit={submit} className="w-full space-y-4 rounded-xl border bg-card p-5 sm:max-w-md"><div className="flex items-center justify-between"><h2 className="font-semibold">Edit informasi peminjam</h2><Button type="button" variant="ghost" size="icon" onClick={()=>setOpen(false)}><X className="h-4 w-4"/></Button></div><div className="space-y-2"><Label htmlFor="edit-name">Nama</Label><Input id="edit-name" name="name" defaultValue={borrower.name} required/></div><div className="space-y-2"><Label htmlFor="edit-phone">Nomor WhatsApp</Label><Input id="edit-phone" name="phone" defaultValue={borrower.phone}/></div><div className="space-y-2"><Label>Tag peminjam</Label><TagInput defaultValue={borrower.tags}/></div><div className="space-y-2"><Label htmlFor="edit-notes">Catatan pribadi</Label><Textarea id="edit-notes" name="notes" defaultValue={borrower.notes}/></div>{error&&<p className="text-sm text-red-400">{error}</p>}<Button disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Pencil className="h-4 w-4"/>}{loading?"Menyimpan...":"Simpan perubahan"}</Button></form>}
