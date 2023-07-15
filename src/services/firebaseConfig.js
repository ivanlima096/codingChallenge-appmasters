import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDE2pys3vNAqCCgzHbN55AUwTBo9zmb1uU",
  authDomain: "appmasters-auth.firebaseapp.com",
  projectId: "appmasters-auth",
  storageBucket: "appmasters-auth.appspot.com",
  messagingSenderId: "97768681409",
  appId: "1:97768681409:web:d2edea92b8fbce3c45c940"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
