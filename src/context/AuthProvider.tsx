import { getCurrentUser } from "@/lib/appwrite/api";
import { transformImageUrl } from "@/lib/utils";
import type { IUser } from "@/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, INITIAL_USER } from "./AuthContext";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();

      const imageUrl = transformImageUrl(currentAccount?.image_url) || "";

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          image_url: imageUrl,
          bio: currentAccount.bio,
        });

        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (
        localStorage.getItem("cookieFallback") === "[]" ||
        localStorage.getItem("cookieFallback") === null
      ) {
        if (pathname !== "/sign-in" && pathname !== "/sign-up") {
          navigate("/sign-in");
        }
      }
      await checkAuthUser();
    };
    initializeAuth();
  }, [navigate, pathname]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
