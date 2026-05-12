// Custom Hook for Wallet Connections
// Manages wallet connection state and operations

import { useState, useEffect, useCallback } from 'react';
import { getUserWalletConnections } from '../services/walletService';
import { onAuthStateChangeListener } from '../services/authService';

export const useWalletConnections = () => {
  const [walletConnections, setWalletConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChangeListener((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  // Fetch wallet connections when user changes
  const fetchConnections = useCallback(async () => {
    if (!user) {
      setWalletConnections([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserWalletConnections();
      if (result.success) {
        setWalletConnections(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    walletConnections,
    isLoading,
    error,
    user,
    refetch: fetchConnections,
  };
};
