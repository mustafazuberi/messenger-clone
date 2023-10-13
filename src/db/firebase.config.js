import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDaAUVXiU_EGWmk6UXBniSp1q7mgrtGXmk",
  authDomain: "messenger-ca7d6.firebaseapp.com",
  projectId: "messenger-ca7d6",
  storageBucket: "messenger-ca7d6.appspot.com",
  messagingSenderId: "159957457030",
  appId: "1:159957457030:web:0b4aecdcf5e309d1645907",
  measurementId: "G-22PFJFBF1R",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { app, db, storage, auth, messaging };
