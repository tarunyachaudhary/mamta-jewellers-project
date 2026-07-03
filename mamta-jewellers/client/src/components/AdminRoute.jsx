import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Only allows logged-in admins through; sends everyone else to the admin login
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminRoute;
