import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Destination Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like this route doesn't exist in our travel plans. Let's get you back on track!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="gradient-hero gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/plan">
              <ArrowLeft className="w-4 h-4" />
              Plan a Trip
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
