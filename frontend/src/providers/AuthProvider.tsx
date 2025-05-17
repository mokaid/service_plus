import { useLocation, Navigate } from "react-router-dom"
import { useAppSelector } from "@/hooks/use-app-selector"

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const token = useAppSelector((state) => state.authState.token);
    // const user = useAppSelector((state) => state.authState.user);
    const location = useLocation();

    return (
        token ? <>{children}</> : <Navigate to={'/login'} state={{from: location}} replace />
    )
}

export default AuthProvider;