import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Star, Thermometer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  description: string;
  rating: number;
  avgTemp: string;
  bestFor: string[];
  popularMonths: string;
}

const destinations: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
    description: 'Sun-kissed beaches, vibrant nightlife, and Portuguese heritage blend seamlessly in India\'s party capital.',
    rating: 4.7,
    avgTemp: '28°C',
    bestFor: ['Beaches', 'Nightlife', 'Water Sports'],
    popularMonths: 'Nov - Feb',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600',
    description: 'The Pink City enchants with majestic forts, ornate palaces, and a rich tapestry of royal Rajasthani culture.',
    rating: 4.6,
    avgTemp: '26°C',
    bestFor: ['History', 'Architecture', 'Shopping'],
    popularMonths: 'Oct - Mar',
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
    description: 'Snow-capped peaks, adventure sports, and serene valleys make this Himalayan gem a year-round paradise.',
    rating: 4.8,
    avgTemp: '15°C',
    bestFor: ['Adventure', 'Nature', 'Trekking'],
    popularMonths: 'Mar - Jun, Oct - Feb',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600',
    description: 'God\'s Own Country offers tranquil backwaters, lush tea gardens, and Ayurvedic wellness retreats.',
    rating: 4.9,
    avgTemp: '27°C',
    bestFor: ['Backwaters', 'Wellness', 'Nature'],
    popularMonths: 'Sep - Mar',
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
    description: 'Home to the iconic Taj Mahal, this city is a testament to Mughal grandeur and timeless love.',
    rating: 4.5,
    avgTemp: '25°C',
    bestFor: ['Heritage', 'Architecture', 'History'],
    popularMonths: 'Oct - Mar',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
    description: 'The spiritual heart of India, where ancient rituals and the sacred Ganges create a mystical experience.',
    rating: 4.4,
    avgTemp: '26°C',
    bestFor: ['Spirituality', 'Culture', 'Photography'],
    popularMonths: 'Oct - Mar',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600',
    description: 'The City of Lakes captivates with romantic palaces, shimmering waters, and timeless royal charm.',
    rating: 4.7,
    avgTemp: '24°C',
    bestFor: ['Romance', 'Lakes', 'Heritage'],
    popularMonths: 'Sep - Mar',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600',
    description: 'The city of dreams pulses with Bollywood glamour, street food delights, and endless energy.',
    rating: 4.5,
    avgTemp: '27°C',
    bestFor: ['Entertainment', 'Food', 'Shopping'],
    popularMonths: 'Nov - Feb',
  },
];

const Destinations = () => {
  const navigate = useNavigate();

  const handleQuickStart = (destinationName: string) => {
    // Pre-fill destination and navigate to plan page
    sessionStorage.setItem('prefilledDestination', destinationName);
    navigate('/plan');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-slide-up">
              <MapPin className="w-4 h-4" />
              Popular Destinations
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Explore India's
              <span className="block mt-2 bg-gradient-to-r from-[hsl(210,85%,45%)] via-[hsl(200,90%,40%)] to-[hsl(185,80%,35%)] bg-clip-text text-transparent">
                Best Destinations
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover handpicked destinations with stunning landscapes, rich culture, and unforgettable experiences. Click any destination to start planning your trip instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm text-sm font-medium">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    {destination.rating}
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <p className="text-sm text-white/80">{destination.state}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {destination.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {destination.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      {destination.avgTemp}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {destination.popularMonths}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleQuickStart(destination.name)}
                    className="w-full gradient-hero hover:opacity-90 transition-opacity gap-2"
                    size="sm"
                  >
                    Plan Trip
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Can't find your destination?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            No worries! You can plan a trip to any destination in India. Just enter your details and let our AI do the magic.
          </p>
          <Button
            onClick={() => navigate('/plan')}
            size="lg"
            className="h-12 px-8 gradient-hero hover:opacity-90 transition-opacity gap-2"
          >
            Custom Trip Planning
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;
