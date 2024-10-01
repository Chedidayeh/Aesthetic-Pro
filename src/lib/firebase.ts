// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import sharp from "sharp";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9GN4v1-PFXdMMgQa8TTSaZDHhqlDPjew",
    authDomain: "tactical-hydra-424919-a1.firebaseapp.com",
    projectId: "tactical-hydra-424919-a1",
    storageBucket: "tactical-hydra-424919-a1.appspot.com",
    messagingSenderId: "238833383237",
    appId: "1:238833383237:web:465c166aebc2cafb9f302c",
    measurementId: "G-S70TH7GG7Z"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(firebaseApp);

export { storage };