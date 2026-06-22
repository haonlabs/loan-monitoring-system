import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getCurrentAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request:Request,{params}:{params:{proofId:string}}){
  const url=new URL(request.url);
  const borrowerId=url.searchParams.get("borrowerId")||"";
  const token=url.searchParams.get("token")||"";
  if(!borrowerId)return NextResponse.json({error:"Bukti tidak ditemukan."},{status:404});
  const borrowerRef=adminDb.collection("borrowers").doc(borrowerId);
  const [admin,borrower,proof]=await Promise.all([getCurrentAdmin(),borrowerRef.get(),borrowerRef.collection("proofs").doc(params.proofId).get()]);
  if(!proof.exists||!borrower.exists)return NextResponse.json({error:"Bukti tidak ditemukan."},{status:404});
  if(!admin&&(!token||borrower.data()?.shareToken!==token))return NextResponse.json({error:"Akses ditolak."},{status:403});
  try{
    const name=String(proof.data()?.originalName||"bukti-transfer").replace(/[\r\n"\\]/g,"_");
    const pathname=String(proof.data()?.blobPathname||"");
    if(pathname){const result=await get(pathname,{access:"private",ifNoneMatch:request.headers.get("if-none-match")||undefined});if(!result)return NextResponse.json({error:"File bukti tidak ditemukan."},{status:404});if(result.statusCode===304)return new Response(null,{status:304,headers:{ETag:result.blob.etag,"Cache-Control":"private, no-cache"}});return new Response(result.stream,{headers:{"Content-Type":result.blob.contentType,"Content-Disposition":`inline; filename="${name}"`,ETag:result.blob.etag,"Cache-Control":"private, no-cache","X-Content-Type-Options":"nosniff"}});}
    const chunks=await proof.ref.collection("chunks").orderBy("index","asc").get();
    if(chunks.empty)throw new Error("File kosong");
    const buffer=Buffer.concat(chunks.docs.map(chunk=>Buffer.from(String(chunk.data().data||""),"base64")));
    return new Response(new Uint8Array(buffer),{headers:{"Content-Type":String(proof.data()?.contentType||"application/octet-stream"),"Content-Disposition":`inline; filename="${name}"`,"Cache-Control":"private, no-cache","X-Content-Type-Options":"nosniff"}});
  }catch{return NextResponse.json({error:"File bukti tidak ditemukan."},{status:404});}
}
