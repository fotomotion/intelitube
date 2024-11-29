import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const firebaseAdmin = 
  getApps().length === 0 
    ? initializeApp({
        credential: cert(firebaseAdminConfig),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
    : getApps()[0];

export const auth = getAuth(firebaseAdmin);