// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCArcsjB5pXXhLt3atkWFRK6ekHlD5G6Ok",
  authDomain: "tarefas-udemy.firebaseapp.com",
  projectId: "tarefas-udemy",
  storageBucket: "tarefas-udemy.firebasestorage.app",
  messagingSenderId: "418818859232",
  appId: "1:418818859232:web:cdf6e7e8a8a820f06a7085"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export {db}
