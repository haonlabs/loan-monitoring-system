import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (decoded.admin !== true) return NextResponse.json({ error: "Akun ini belum memiliki akses sebagai pemberi pinjaman." }, { status: 403 });
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const session = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("session", session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: expiresIn / 1000, path: "/" });
    return response;
  } catch { return NextResponse.json({ error: "Login gagal." }, { status: 401 }); }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
