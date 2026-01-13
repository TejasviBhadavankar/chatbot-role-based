import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== user.role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
