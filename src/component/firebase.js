import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDauBAjCIkul33gLBU_1fwHrovUNReW4eA",
  authDomain: "weaather-app-112e2.firebaseapp.com",
  projectId: "weaather-app-112e2",
  storageBucket: "weaather-app-112e2.appspot.com",
  messagingSenderId: "676550817610",
  appId: "1:676550817610:web:0bea0c35a4a028a43873b3",
  measurementId: "G-BETSHJ64EZ",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const usersCollection = db.collection("users");
const auth = firebase.auth();

export { firebase, db, usersCollection, auth };
