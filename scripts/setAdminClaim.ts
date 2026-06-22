import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

async function main() {
  const uid = process.argv[2];
  if (!uid) throw new Error("Gunakan: npm run set-admin -- UID_FIREBASE");
  const app = getApps()[0] ?? initializeApp({ credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
  }) });
  await getAuth(app).setCustomUserClaims(uid, { admin: true });
  console.log(`Admin claim berhasil di-set untuk ${uid}`);
}

main().catch(error => { console.error(error); process.exit(1); });
