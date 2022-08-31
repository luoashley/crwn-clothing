import { initializeApp } from "firebase/app";
import {getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
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
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const db = getFirestore();
export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users',userAuth.uid);
    console.log(userDocRef);
    const userSnapshot = await getDoc(userDocRef);
    if(!userSnapshot.exists()){
        const {displayName, email} = userAuth;
        const createdAt = new Date();
        try{
            await setDoc(userDocRef, {displayName, email, createdAt});
        }catch (error){
            console.log('error creating the user', error.messages);
        }
    }
    return userDocRef;
};
