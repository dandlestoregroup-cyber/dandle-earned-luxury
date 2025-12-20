import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_KEY_STORAGE = "dandle_admin_key";

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const envKey = import.meta.env.VITE_ADMIN_KEY;
    
    // If no admin key is configured, block access
    if (!envKey) {
      setIsAuthorized(false);
      return;
    }

    // Check URL param first
    const urlKey = searchParams.get("key");
    if (urlKey === envKey) {
      localStorage.setItem(ADMIN_KEY_STORAGE, urlKey);
      setIsAuthorized(true);
      return;
    }

    // Check localStorage
    const storedKey = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (storedKey === envKey) {
      setIsAuthorized(true);
      return;
    }

    // Not authorized
    setIsAuthorized(false);
  }, [searchParams]);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authorized - show 404
  if (!isAuthorized) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default AdminLayout;
