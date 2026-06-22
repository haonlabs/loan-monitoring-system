import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const adminApp = getApps()[0] ?? initializeApp(
  projectId && clientEmail && key
    ? { credential: cert({ projectId, clientEmail, privateKey: key }) }
    : { projectId: projectId || "firebase-config-belum-diisi" }
);

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
