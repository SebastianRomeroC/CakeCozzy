import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3gkePXhtdt9PFbxadzvW7qwtDCLXHKTg",
  authDomain: "cakecozzy.firebaseapp.com",
  projectId: "cakecozzy",
  storageBucket: "cakecozzy.firebasestorage.app",
  messagingSenderId: "235510332924",
  appId: "1:235510332924:web:0d399342e0b447baa60679",
  measurementId: "G-D350Y9HPE0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Persistencia en localStorage
setPersistence(auth, browserLocalPersistence).catch((e) =>
  console.error("Persistencia:", e)
);

// Helpers de errores legibles
const asCode = (e) => (e && e.code) || "error/unknown";

// --- Email+Password: REGISTRO (con nombre)
export async function registerWithEmail(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name || "" });

  // Guarda datos en Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    name: name || "",
    email,
    role: "user", // por defecto
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

// --- Email+Password: LOGIN
export async function loginWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

// --- Google: LOGIN
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);

  // Crea/actualiza documento de usuario
  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName || "",
      email: user.email || "",
      role: "user",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

// --- LOGOUT
export async function logout() {
  await signOut(auth);
}

// Export default para compatibilidad
export default app;
