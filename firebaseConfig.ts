import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBeUc4WkZ3L9VIxTegt5XA1i7dc73mu274",
  authDomain: "mynotesapp-4f576.firebaseapp.com",
  databaseURL: "https://mynotesapp-4f576-default-rtdb.firebaseio.com",
  projectId: "mynotesapp-4f576",
  storageBucket: "mynotesapp-4f576.firebasestorage.app",
  messagingSenderId: "220400808806",
  appId: "1:220400808806:web:bcf6ec9e42563a4cb20ea7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
