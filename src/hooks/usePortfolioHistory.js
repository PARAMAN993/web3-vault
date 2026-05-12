import { useEffect, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function usePortfolioHistory(uid, totalValue) {
  const lastSavedValueRef = useRef(null);
  const lastSaveTimeRef = useRef(0);

  useEffect(() => {
    if (!uid || totalValue == null) return;

    const savePortfolio = async () => {
      try {
        const now = Date.now();

        // ⏱ Save every 60 seconds max
        if (now - lastSaveTimeRef.current < 60000) return;

        // 🧠 Avoid small changes spam
        if (
          lastSavedValueRef.current !== null &&
          Math.abs(totalValue - lastSavedValueRef.current) < 50
        ) {
          return;
        }

        await addDoc(collection(db, "users", uid, "portfolioHistory"), {
          totalValue,
          timestamp: serverTimestamp(),
        });

        console.log("✅ Portfolio saved:", totalValue);

        lastSavedValueRef.current = totalValue;
        lastSaveTimeRef.current = now;
      } catch (err) {
        console.error("❌ Save error:", err);
      }
    };

    savePortfolio();
  }, [uid, totalValue]);
}