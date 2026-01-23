import { Plane, Users, Sparkles, MapPin, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Our intelligent system analyzes thousands of options to create the perfect itinerary tailored to your preferences.'
    },
    {
      icon: MapPin,
      title: 'Real-Time Data',
      description: 'Get up-to-date information on hotels, weather, transport, and attractions from trusted sources.'
    },
    {
      icon: Target,
      title: 'Smart Recommendations',
      description: 'Personalized suggestions based on your budget, travel style, and interests.'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Built by travel enthusiasts who understand the joy of exploring new destinations.'
    }
  ];

  const teamMembers = [
    { name: 'TactTrip Team', role: 'Developers' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About TactTrip
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              TactTrip is an AI-powered travel planning platform designed to make trip planning 
              effortless and enjoyable. We combine cutting-edge technology with real-time data 
              to help you discover perfect destinations, find the best accommodations, and 
              create unforgettable travel experiences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted/30 py-16 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To revolutionize travel planning by leveraging artificial intelligence to provide 
                personalized, budget-friendly, and hassle-free trip itineraries. We believe everyone 
                deserves a memorable travel experience, and we're here to make that happen.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">What Makes Us Different</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="bg-muted/30 py-16 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-8">Technology Stack</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[
                  'React + TypeScript',
                  'Tailwind CSS',
                  'Geoapify API',
                  'Open Weather API',
                  'Supabase Edge Functions',
                  'Vite'
                ].map((tech) => (
                  <div 
                    key={tech}
                    className="bg-background rounded-lg px-4 py-3 text-center font-medium text-foreground shadow-sm border border-border/50"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Built By</h2>
            <div className="flex justify-center">
              {teamMembers.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <Card className="border-border/50 shadow-card gradient-hero text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Let TactTrip help you plan your next adventure with AI-powered recommendations 
                and real-time travel data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/plan">Plan Your Trip</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Link to="/destinations">Explore Destinations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
