import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYy-q4oVL6jguO_vPwwiDAebgiW1oS0bs",
  authDomain: "chat-app-5fd64.firebaseapp.com",
  projectId: "chat-app-5fd64",
  storageBucket: "chat-app-5fd64.appspot.com",
  messagingSenderId: "504406944746",
  appId: "1:504406944746:web:867939919b128ca1caa093",
  measurementId: "G-Y62N12S7FJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
