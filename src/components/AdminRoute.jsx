// src/components/AdminRoute.jsx
//
// Protects the admin dashboard. Only the user whose UID (or email)
// matches ADMIN_UID can access it. Everyone else is redirected away.
//
// HOW TO USE in your router (e.g. App.jsx):
//
//   import AdminRoute from "./components/AdminRoute";
//   import AdminDashboard from "./pages/AdminDashboard";
//
//   <Route path="/admin" element={
//     <AdminRoute>
//       <AdminDashboard />
//     </AdminRoute>
//   } />

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";


// ── Set this to your admin Firebase UID or email ──────────────────
// Find your UID in Firebase Console → Authentication → Users
const ADMIN_UID = "dJyRWesPqiMXLOznhcB9mA0sfu02"; // e.g. "abc123XYZuid"
// ─────────────────────────────────────────────────────────────────

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "allowed" | "denied"

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("Current UID:", user?.uid);
      console.log("Admin UID:", ADMIN_UID);
      if (!user) {
        setStatus("denied");
       } else if (user.uid === ADMIN_UID) {
  setStatus("allowed");
} else {
  setStatus("denied");
}
    });
    return unsub;
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#080c14",
          color: "#5a6a7e",
          fontSize: 15,
        }}
      >
        Verifying access…
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/ledger-login" state={{ from: "/admin" }} replace />;
  }

  return children;
}

export default AdminRoute;
