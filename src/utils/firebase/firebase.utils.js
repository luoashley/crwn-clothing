import { initializeApp } from "firebase/app";
import {getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs} from 'firebase/firestore';

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

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd, field='title') => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);
    objectsToAdd.forEach((object)=>{
        const docRef = doc(collectionRef, object[field].toLowerCase());
        batch.set(docRef, object);
     });
    await batch.commit();
    console.log('done');
};

export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
        const {title, items} = docSnapshot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    },{});
    return categoryMap;
}

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

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
    onAuthStateChanged(auth, callback);

/*
* {
*  next: callback,
* error: errorCallback,
* complete: completedCallback
* }
* */