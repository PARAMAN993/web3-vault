import { auth } from "../firebase/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

/* =========================
   REGISTER USER
========================= */
export const registerUser = async (
  email,
  password
) => {
  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // send verification email
    await sendEmailVerification(
      userCredential.user
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (
  email,
  password
) => {
  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    await userCredential.user.reload();

    const isVerified =
      userCredential.user.emailVerified;

    return {
      success: true,
      user: userCredential.user,
      verified: isVerified,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================
   LOGOUT
========================= */
export const logoutUser =
  async () => {
    await signOut(auth);
  };

/* =========================
   AUTH STATE
========================= */
export const listenToAuth = (
  callback
) => {
  return onAuthStateChanged(
    auth,
    callback
  );
};