// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [user, setUser] =
    useState(undefined);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(
            currentUser
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // Loading auth state
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "#050816",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          color: "white",
          fontSize: "1.1rem",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/ledger-login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;