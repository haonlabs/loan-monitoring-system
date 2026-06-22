import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function getCurrentAdmin() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  try {
    const user = await adminAuth.verifySessionCookie(token, true);
    return user.admin === true ? user : null;
  } catch { return null; }
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/login");
  return user;
}
