import { Navigate } from "react-router-dom";

function OwnerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "owner") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default OwnerRoute;