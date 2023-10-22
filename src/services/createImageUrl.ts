import { storage } from "@/db/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const createImageUrl = async (image: File): Promise<string> => {
  const storageRef = ref(storage, `images/${image.name}`);
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};


export default createImageUrl