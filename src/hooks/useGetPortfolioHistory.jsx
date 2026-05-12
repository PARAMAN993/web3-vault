import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useGetPortfolioHistory(uid) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "users", uid, "portfolioHistory"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          value: d.totalValue,
          time: d.timestamp?.toDate?.() || new Date(),
        };
      });

      setHistory(data);
    });

    return () => unsubscribe();
  }, [uid]);

  return history;
}