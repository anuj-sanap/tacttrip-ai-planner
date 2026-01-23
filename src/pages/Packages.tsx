import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Tag, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { travelPackages, TravelPackage } from '@/data/packagesData';

const Packages = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'beach', label: 'Beach' },
    { id: 'heritage', label: 'Heritage' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'spiritual', label: 'Spiritual' },
  ];

  const filteredPackages = selectedCategory === 'all' 
    ? travelPackages 
    : travelPackages.filter(pkg => pkg.category === selectedCategory);

  const getCategoryColor = (category: TravelPackage['category']) => {
    const colors = {
      beach: 'bg-blue-100 text-blue-700',
      heritage: 'bg-amber-100 text-amber-700',
      adventure: 'bg-green-100 text-green-700',
      spiritual: 'bg-purple-100 text-purple-700',
      hill: 'bg-teal-100 text-teal-700'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Travel Packages
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked packages with hotels, transport, and sightseeing included. 
              Just select, book, and travel hassle-free!
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? 'gradient-hero' : ''}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className="overflow-hidden border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${getCategoryColor(pkg.category)}`}>
                    {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                  </Badge>
                  {pkg.originalPrice && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                      {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Title & Location */}
                  <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{pkg.destination}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-3 h-3" />
                    <span>{pkg.duration.nights}N / {pkg.duration.days}D</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-foreground">{pkg.rating}</span>
                    <span className="text-muted-foreground text-sm">({pkg.reviewCount} reviews)</span>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs font-normal">
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">per person</span>
                    </div>
                    <Button asChild size="sm" className="gradient-hero">
                      <Link to={`/packages/${pkg.id}`}>
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No packages found in this category.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Packages;
