import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Only allows logged-in customers through; sends everyone else to /login
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
