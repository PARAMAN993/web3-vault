// src/components/AdminRoute.jsx
//
// Protects the admin dashboard. Only users whose UID is in the
// ADMIN_UIDS array can access it. Everyone else is redirected away.
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

// ── Add any admin Firebase UIDs here ─────────────────────────────
// Find UIDs in Firebase Console → Authentication → Users
const ADMIN_UIDS = [
  "k6092ZfyXdQ6h5wqzpBln5FCkdp2",
  "dJyRWesPqiMXLOznhcB9mA0sfu02",
];
// ─────────────────────────────────────────────────────────────────

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "allowed" | "denied"

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setStatus("denied");
      } else if (ADMIN_UIDS.includes(user.uid)) {
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
