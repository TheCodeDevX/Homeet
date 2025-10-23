import { type PropsWithChildren } from "react";
import { useAuthStore, type UserRole } from "../store/auhStore";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./Spinner";

  export const ProtectRoute = ({children} : PropsWithChildren) => {

      const location = useLocation();
      const {pathname} = location;

  const {isAuthenticated, user, isCheckingAuth, isLoading} = useAuthStore();

  if(!isAuthenticated && !isLoading) return <Navigate to="/login" replace/>
  if(!user?.isVerified && !isLoading) return <Navigate to="/verify-email" replace/>
  if(!user?.onBoarded && !isLoading) return <Navigate to="/onboarding" replace/>
  if( !(["seller", "homeowner"].includes(user?.role as UserRole))
   && ( pathname.startsWith("/dashboard") || pathname.startsWith("/post-listing"))) return <Navigate to="/" replace/>
  return <>{children}</>
  }


   export const RedirectAuthenticatedUser = ({children} : PropsWithChildren) => {
    const {isAuthenticated, user} = useAuthStore();
    if(isAuthenticated && user?.isVerified && user?.onBoarded) return <Navigate to="/" replace/>
    return <>{children}</>
  }
  