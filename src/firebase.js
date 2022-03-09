// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClu2O0b_0MWfuqenWAct0QHqYo1xHG4rc",
  authDomain: "xogameg1.firebaseapp.com",
  projectId: "xogameg1",
  storageBucket: "xogameg1.appspot.com",
  messagingSenderId: "81594269941",
  appId: "1:81594269941:web:c71d3217c52048954a85bc",
  databaseURL: "https://xogameg1-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;