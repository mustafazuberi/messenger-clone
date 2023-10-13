import { db } from "@/db/firebase.config";
import User from "@/types/types.user";
import { doc, getDoc } from "firebase/firestore";

const fetchUserByUid = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return null;
  }
};

export default fetchUserByUid;
