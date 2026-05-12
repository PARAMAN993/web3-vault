import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

export function usePortfolio(uid, prices) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid);

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setAssets(data?.assets || []);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const portfolio = assets.map((asset) => {
    const price = prices?.[asset.symbol]?.usd || 0;

    return {
      ...asset,
      price,
      value: asset.amount * price,
    };
  });

  const total = portfolio.reduce((sum, a) => sum + a.value, 0);

  return { assets: portfolio, total, loading };
}