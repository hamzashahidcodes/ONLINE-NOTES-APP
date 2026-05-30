import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs8JqfUkwVcR-KiFF8IeOghHe62lDOveo",
  authDomain: "online-notes-app-b3c6e.firebaseapp.com",
  projectId: "online-notes-app-b3c6e",
  storageBucket: "online-notes-app-b3c6e.firebasestorage.app",
  messagingSenderId: "468034984341",
  appId: "1:468034984341:web:b60ffe8ce0bec899773e9c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);