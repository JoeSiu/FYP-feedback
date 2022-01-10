// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyD3UyYTi6GvbrM6P05EtGfRHHjKwq3J6Jw",
    authDomain: "botpulation.firebaseapp.com",
  projectId: "botpulation",
  storageBucket: "https://firebasestorage.googleapis.com/v0/b/botpulation.appspot.com/o",
  });
  
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();