import { FirebaseError } from "firebase/app";
import firebaseErrorCodes from "./codeAndMessages";

const handleFirebaseError = (error: FirebaseError): string => {
  const message: string = firebaseErrorCodes[error.code];
  if (!message) {
    console.log(error.code);
  }
  return message;
};

export default handleFirebaseError;
