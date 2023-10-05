import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, ref } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };
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

export { app, db, storage, auth };
