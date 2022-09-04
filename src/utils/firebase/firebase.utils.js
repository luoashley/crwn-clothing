import { initializeApp } from "firebase/app";
import {getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLBT_mgFwIzL0hm1rSixA4wwkV90MZKWk",
    authDomain: "crwn-clothing-db-c2775.firebaseapp.com",
    projectId: "crwn-clothing-db-c2775",
    storageBucket: "crwn-clothing-db-c2775.appspot.com",
    messagingSenderId: "672343834784",
    appId: "1:672343834784:web:67f07689b80293525009c5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithGoogleRedirect(auth, googleProvider);
export const db = getFirestore();

export const createUserDocumentFromAuth = async (
    userAuth,
    additionalInformation = {}
) => {
    if(!userAuth) return;
    const userDocRef = doc(db, 'users',userAuth.uid);
    console.log(userDocRef);
    const userSnapshot = await getDoc(userDocRef);
    if(!userSnapshot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        try{
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation,
            });
        }catch (error){
            console.log('error creating the user', error.messages);
        }
    }
    return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email,password) => {
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email,password) => {
    if(!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
};