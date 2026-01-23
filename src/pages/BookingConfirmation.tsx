import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, MapPin, Clock, Calendar, Users, 
  ChevronLeft, ArrowRight, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getPackageById } from '@/data/packagesData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SavedBooking {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  duration: string;
  image: string;
  price: number;
  travelDate: string;
  travelers: number;
  bookedAt: string;
  status: 'upcoming' | 'completed';
}

const BOOKINGS_STORAGE_KEY = 'tacttrip_package_bookings';

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  const pkg = id ? getPackageById(id) : undefined;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Package Not Found</h1>
            <Button asChild>
              <Link to="/packages">Browse Packages</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = pkg.price * travelers;

  const handleConfirmBooking = async () => {
    if (!travelDate) {
      toast.error('Please select a travel date');
      return;
    }

    setIsBooking(true);

    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save booking to localStorage
    const existingBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const bookings: SavedBooking[] = existingBookings ? JSON.parse(existingBookings) : [];

    const newBooking: SavedBooking = {
      id: `booking-${Date.now()}`,
      packageId: pkg.id,
      packageName: pkg.name,
      destination: pkg.destination,
      duration: `${pkg.duration.nights}N/${pkg.duration.days}D`,
      image: pkg.image,
      price: totalPrice,
      travelDate,
      travelers,
      bookedAt: new Date().toISOString(),
      status: 'upcoming'
    };

    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));

    setIsBooking(false);
    setIsBooked(true);
    toast.success('Booking confirmed successfully!');
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-border/50 shadow-card text-center">
              <CardContent className="py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your trip to {pkg.destination} has been booked successfully.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{pkg.destination}</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Travel Date</span>
                      <p className="font-medium text-foreground">
                        {new Date(travelDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Travelers</span>
                      <p className="font-medium text-foreground">{travelers} person(s)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration</span>
                      <p className="font-medium text-foreground">
                        {pkg.duration.nights}N / {pkg.duration.days}D
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Amount</span>
                      <p className="font-medium text-primary">₹{totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link to="/packages">Browse More Packages</Link>
                  </Button>
                  <Button asChild className="gradient-hero">
                    <Link to="/bookings">
                      View My Bookings
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(`/packages/${id}`)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Package
          </Button>

          <div className="grid gap-8 md:grid-cols-5">
            {/* Form */}
            <div className="md:col-span-3">
              <Card className="border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle>Complete Your Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Traveler Info */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Traveler Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={user?.name || ''} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled className="bg-muted" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Trip Details */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Trip Details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel Date *</Label>
                        <Input
                          id="travelDate"
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          >
                            -
                          </Button>
                          <Input
                            id="travelers"
                            type="number"
                            value={travelers}
                            onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                            className="text-center w-20"
                            min={1}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setTravelers(travelers + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Confirm Button */}
                  <Button 
                    className="w-full gradient-hero h-12 text-base"
                    onClick={handleConfirmBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By confirming, you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="md:col-span-2">
              <Card className="border-border/50 shadow-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Package Info */}
                  <div className="flex gap-3">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-2">{pkg.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{pkg.destination}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Duration
                      </div>
                      <span className="font-medium">{pkg.duration.nights}N/{pkg.duration.days}D</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Travel Date
                      </div>
                      <span className="font-medium">
                        {travelDate 
                          ? new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                          : 'Select date'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Travelers
                      </div>
                      <span className="font-medium">{travelers} person(s)</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per person</span>
                      <span>₹{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travelers</span>
                      <span>× {travelers}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
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

export default BookingConfirmation;
