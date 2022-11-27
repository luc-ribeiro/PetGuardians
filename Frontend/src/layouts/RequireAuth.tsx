import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
    allowedRoles?: string[]
}
export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        !auth
            ? <Navigate to="/login" state={{ from: location }} replace />
            : !allowedRoles || allowedRoles.includes(auth?.role)
                ? <Outlet />
                : <Navigate to="/not-found" state={{ from: location }} replace />
    );
}