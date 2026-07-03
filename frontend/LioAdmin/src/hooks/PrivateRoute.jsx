import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth";

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return <Outlet />
}

export default PrivateRoute;