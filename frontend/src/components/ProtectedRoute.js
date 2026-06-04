import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    // ❌ Role mismatch
    if (roleRequired && decoded.role !== roleRequired) {
      return <Navigate to="/dashboard" />;
    }

    return children;

  } catch (error) {
    // ❌ Invalid token
    localStorage.clear();
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;