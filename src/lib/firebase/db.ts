import { db } from "./config";
import { collection, doc, setDoc, getDocs, query, where, writeBatch } from "firebase/firestore";

export async function saveToFirestore(collectionName: string, data: any[]) {
  const batch = writeBatch(db);

  data.forEach((item) => {
    const ref = doc(db, collectionName, item.id);
    batch.set(ref, item, { merge: true });
  });

  return batch.commit();
}

export async function getTikTokVideos() {
  const videosRef = collection(db, "tiktok_videos");
  const q = query(videosRef, where("platform", "==", "tiktok"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}