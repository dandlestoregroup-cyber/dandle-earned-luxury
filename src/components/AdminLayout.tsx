import { ReactNode, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NotFound from "@/pages/NotFound";

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;
const STORAGE_KEY = "dandle_admin_auth";

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check query param first
    const keyFromUrl = searchParams.get("key");
    
    // Check localStorage for persisted auth
    const storedKey = localStorage.getItem(STORAGE_KEY);

    if (ADMIN_KEY && keyFromUrl === ADMIN_KEY) {
      // Valid key in URL - store it and authorize
      localStorage.setItem(STORAGE_KEY, keyFromUrl);
      setIsAuthorized(true);
    } else if (ADMIN_KEY && storedKey === ADMIN_KEY) {
      // Valid key in storage - authorize
      setIsAuthorized(true);
    } else if (!ADMIN_KEY) {
      // No admin key configured - allow access (dev mode)
      setIsAuthorized(true);
    } else {
      // Invalid or missing key
      setIsAuthorized(false);
    }
  }, [searchParams]);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  // Unauthorized - show 404
  if (!isAuthorized) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default AdminLayout;