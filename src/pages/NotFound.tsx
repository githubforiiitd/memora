
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-memora-purple">404</h1>
        <p className="text-xl text-foreground mb-6">
          Oops! We couldn't find this memory.
        </p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <a href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Return to memories
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
