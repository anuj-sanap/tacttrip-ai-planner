import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, Sparkles, MapPin, Wallet, Clock, Shield, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Smart recommendations based on your budget and preferences',
    },
    {
      icon: Wallet,
      title: 'Budget Optimization',
      description: 'Get the most value from every rupee you spend',
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Complete travel plans generated in seconds',
    },
    {
      icon: Shield,
      title: 'Trusted Suggestions',
      description: 'Curated options from reliable travel sources',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Trips Planned' },
    { value: '50+', label: 'Destinations' },
    { value: '4.8', label: 'User Rating', icon: Star },
    { value: '100%', label: 'Free to Use' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Travel Planning
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Plan Smarter Trips
              <span className="block mt-2 bg-gradient-to-r from-[hsl(210,85%,45%)] via-[hsl(200,90%,40%)] to-[hsl(185,80%,35%)] bg-clip-text text-transparent">
                Within Your Budget
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              TactTrip uses intelligent AI to create personalized travel plans that maximize your experience while respecting your budget. Transport, hotels, attractions — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button
                size="lg"
                onClick={() => navigate('/plan')}
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold gradient-hero hover:opacity-90 transition-opacity gap-2"
              >
                Plan My Trip
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/destinations')}
                className="w-full sm:w-auto h-14 px-8 text-lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Destinations
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card border border-border shadow-card">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
                  {stat.icon && <stat.icon className="w-5 h-5 text-accent fill-accent" />}
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose TactTrip?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent travel planning system takes the stress out of trip planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">Three simple steps to your perfect trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Enter Details', desc: 'Share your budget, source, destination, and travel dates' },
              { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes thousands of options to find the best matches' },
              { step: '3', title: 'Get Your Plan', desc: 'Receive a complete travel plan with transport, hotels, and more' },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                    <div className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/plan')}
              className="h-14 px-8 text-lg font-semibold gradient-hero hover:opacity-90 transition-opacity gap-2"
            >
              Start Planning Now
              <Plane className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
