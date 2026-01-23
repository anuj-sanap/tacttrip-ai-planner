import { User, Mail, LogOut, MapPin, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { label: 'Trips Planned', value: '5' },
    { label: 'Cities Visited', value: '8' },
    { label: 'Reviews Given', value: '12' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <Card className="border-border/50 shadow-card mb-6 overflow-hidden">
            <div className="h-24 gradient-hero" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left pb-2">
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50 shadow-card text-center">
                <CardContent className="py-6">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Info */}
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium text-foreground">{user?.name}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-muted-foreground">Email Address</label>
                  <p className="font-medium text-foreground">{user?.email}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-muted-foreground">Member Since</label>
                  <p className="font-medium text-foreground">January 2025</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => navigate('/bookings')}
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  View My Bookings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => navigate('/hotels')}
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  Search Hotels
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => navigate('/plan')}
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  Plan New Trip
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
