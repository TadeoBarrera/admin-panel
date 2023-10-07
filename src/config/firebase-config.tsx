import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/firestore';

// Initialize Firebase
export const app = firebase.initializeApp( {
    apiKey: "AIzaSyBVOHN4MjURUBvmaG-0zW22XrJXytvmppk",
    authDomain: "admin-panel-frisa.firebaseapp.com",
    projectId: "admin-panel-frisa",
    storageBucket: "admin-panel-frisa.appspot.com",
    messagingSenderId: "470854728657",
    appId: "1:470854728657:web:f3e473aa265f697f7f3ef0"
});

export const storage = firebase.storage;
export const db = firebase.firestore();
export const auth = firebase.auth()