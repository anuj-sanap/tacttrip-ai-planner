import { useState } from 'react';
import { Search, MapPin, Star, Wifi, Car, Coffee, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHotelData } from '@/hooks/useHotelData';

const Hotels = () => {
  const [searchCity, setSearchCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  
  const { hotels, isLoading, error } = useHotelData(submittedCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setSubmittedCity(searchCity.trim());
    }
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi className="w-3 h-3" />,
    'Parking': <Car className="w-3 h-3" />,
    'Restaurant': <Coffee className="w-3 h-3" />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search hotels by city and discover amazing accommodations for your next trip
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter city name (e.g., Mumbai, Delhi, Jaipur)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" className="gradient-hero h-12 px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Results */}
          {!submittedCity && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Search for hotels</h3>
              <p className="text-muted-foreground">Enter a city name to find available hotels</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Searching hotels in {submittedCity}...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-destructive">Failed to load hotels. Please try again.</p>
            </div>
          )}

          {hotels && hotels.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Hotels in {submittedCity}
                </h2>
                <span className="text-muted-foreground">{hotels.length} hotels found</span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
                        <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" />
                        {hotel.rating.toFixed(1)}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{hotel.distance} from center</span>
                      </div>
                      
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenityIcons[amenity] || null}
                              <span className="ml-1">{amenity}</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">₹{hotel.pricePerNight.toLocaleString()}</span>
                          <span className="text-muted-foreground text-sm">/night</span>
                        </div>
                        <Button size="sm" className="gradient-hero">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {hotels && hotels.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hotels found in {submittedCity}. Try another city.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hotels;
