import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Clock, Star, Hotel, Car, Utensils, Camera, 
  ChevronLeft, Check, Calendar, Users, Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPackageById } from '@/data/packagesData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PackageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const pkg = id ? getPackageById(id) : undefined;

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Package Not Found</h1>
            <p className="text-muted-foreground mb-6">The package you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/packages">Browse Packages</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a package');
      navigate('/login', { state: { from: { pathname: `/packages/${id}` } } });
      return;
    }
    navigate(`/booking-confirmation/${pkg.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/packages')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Packages
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title Section */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.duration.nights} Nights / {pkg.duration.days} Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium text-foreground">{pkg.rating}</span>
                        <span>({pkg.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary" className="py-1.5">
                      <Check className="w-3 h-3 mr-1" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="inclusions" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="inclusions">What's Included</TabsTrigger>
                  <TabsTrigger value="itinerary">Day-wise Itinerary</TabsTrigger>
                </TabsList>

                <TabsContent value="inclusions" className="space-y-4">
                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6 space-y-6">
                      {/* Hotel */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Hotel className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Accommodation</h4>
                          <p className="text-muted-foreground">{pkg.inclusions.hotel}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Transport */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Transport</h4>
                          <p className="text-muted-foreground">{pkg.inclusions.transport}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Meals */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Meals</h4>
                          <p className="text-muted-foreground">{pkg.inclusions.meals}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Sightseeing */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Camera className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Sightseeing</h4>
                          <div className="flex flex-wrap gap-2">
                            {pkg.inclusions.sightseeing.map((place) => (
                              <Badge key={place} variant="outline" className="font-normal">
                                {place}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4">
                  {pkg.itinerary.map((day, index) => (
                    <Card key={day.day} className="border-border/50 shadow-card">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground font-bold">{day.day}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{day.title}</h4>
                            <p className="text-muted-foreground">{day.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 shadow-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="text-center pb-4 border-b border-border">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold text-primary">
                        ₹{pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                    {pkg.originalPrice && (
                      <Badge className="mt-2 bg-green-100 text-green-700">
                        Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{pkg.duration.nights}N/{pkg.duration.days}D Duration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Best for Couples/Families</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Free Cancellation (48hrs)</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Book Button */}
                  <Button 
                    className="w-full gradient-hero h-12 text-base"
                    onClick={handleBookNow}
                  >
                    Book This Package
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    No payment required now. Pay at the time of travel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PackageDetails;
