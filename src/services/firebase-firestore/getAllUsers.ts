import { db } from "@/db/firebase.config";
import User from "@/types/types.user";
import { QuerySnapshot, collection, onSnapshot } from "firebase/firestore";

const getAllUsers = async () => {
  const users: User[] = [];

  try {
    const querySnapshot: QuerySnapshot = await new Promise(
      (resolve, reject) => {
        const unsubscribe = onSnapshot(
          collection(db, "users"),
          (querySnapshot) => {
            unsubscribe();
            resolve(querySnapshot);
          },
          reject
        );
      }
    );

    querySnapshot.forEach((doc) => {
      const userData = doc.data() as User;
      users.push(userData);
    });

    return users;
  } catch (error) {
    throw error;
  }
};

export default getAllUsers;
