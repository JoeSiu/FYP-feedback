// Import the functions you need from the SDKs you need
import { initializeApp } from "./node_modules/firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3UyYTi6GvbrM6P05EtGfRHHjKwq3J6Jw",
  authDomain: "botpulation.firebaseapp.com",
  databaseURL: "https://botpulation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "botpulation",
  storageBucket: "botpulation.appspot.com",
  messagingSenderId: "880503563342",
  appId: "1:880503563342:web:d9d18e25f26887b21c0f1f",
  measurementId: "G-M9YPK5D6MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Read data
database.ref('data').on('value',(snap)=>{
    console.log(snap.val());
  });