import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useUserRole } from "../hooks/useUserRole";

export default function RoleRoute({ children, requiredRole }) {
  const [user, loading] = useAuthState(auth);
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) {
    // si no tiene el rol requerido, mandamos según su rol real
    return <Navigate to={role === "admin" ? "/admin" : "/home"} replace />;
  }

  return children;
}
