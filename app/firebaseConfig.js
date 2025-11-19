// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRvjFWvGx8l_iBddD4zjgRKxYJRtuhlaU",
  authDomain: "unimart-4970b.firebaseapp.com",
  databaseURL: "https://unimart-4970b-default-rtdb.firebaseio.com",
  projectId: "unimart-4970b",
  storageBucket: "unimart-4970b.firebasestorage.app",
  messagingSenderId: "365899462053",
  appId: "1:365899462053:web:f21363d0ef741942bb244c",
  measurementId: "G-TQRY8DPF1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
