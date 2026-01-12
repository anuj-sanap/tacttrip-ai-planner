import { Plane, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">TactTrip</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-1">AI Travel Agent</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/destinations" 
              className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Destinations</span>
            </Link>
            <Link 
              to="/plan" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Plan Trip
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
