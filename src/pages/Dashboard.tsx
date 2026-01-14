import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Building, RefreshCw, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransportCard from '@/components/TransportCard';
import HotelCard from '@/components/HotelCard';
import WeatherWidget from '@/components/WeatherWidget';
import BudgetSummary from '@/components/BudgetSummary';
import ExperienceSection from '@/components/ExperienceSection';
import LoadingState from '@/components/LoadingState';
import { TravelInput, TravelPlan, TransportOption, HotelOption } from '@/types/travel';
import { generateTravelPlan } from '@/utils/aiLogic';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useTransportData } from '@/hooks/useTransportData';
import { useHotelData } from '@/hooks/useHotelData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState<'cheapest' | 'fastest' | 'balanced'>('balanced');
  const [budget, setBudget] = useState(0);

  // Fetch real-time data
  const { 
    weather: realTimeWeather, 
    attractions: realTimeAttractions, 
    food: realTimeFood, 
    shopping: realTimeShopping,
    isLoading: isRealTimeLoading,
    refetch: refetchRealTimeData
  } = useRealTimeData(destination);

  // Fetch real-time transport options
  const {
    transport: realTimeTransport,
    route: transportRoute,
    isLoading: isTransportLoading,
    refetch: refetchTransport
  } = useTransportData(source, destination);

  // Fetch real-time hotel options
  const {
    hotels: realTimeHotels,
    isLoading: isHotelsLoading,
    refetch: refetchHotels
  } = useHotelData(destination);

  useEffect(() => {
    // Get travel input from sessionStorage
    const storedInput = sessionStorage.getItem('travelInput');
    
    if (!storedInput) {
      navigate('/plan');
      return;
    }

    const input: TravelInput = JSON.parse(storedInput);
    setSource(input.source);
    setDestination(input.destination);
    setPreference(input.preference);
    setBudget(input.budget);
    
    // Generate travel plan
    const timer = setTimeout(() => {
      const plan = generateTravelPlan(input);
      setTravelPlan(plan);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNewPlan = () => {
    sessionStorage.removeItem('travelInput');
    navigate('/plan');
  };

  const handleRefreshAll = () => {
    refetchRealTimeData();
    refetchTransport();
    refetchHotels();
  };

  if (isLoading || !travelPlan) {
    return <LoadingState />;
  }

  // Process and recommend transport options based on preference
  const processTransportOptions = (options: TransportOption[]): TransportOption[] => {
    if (options.length === 0) return [];
    
    const sorted = [...options];
    
    if (preference === 'cheapest') {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (preference === 'fastest') {
      sorted.sort((a, b) => {
        const getDurationMinutes = (duration: string) => {
          const parts = duration.match(/(\d+)h\s*(\d+)?m?/);
          if (!parts) return 0;
          return parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      });
    } else {
      sorted.sort((a, b) => {
        const getDurationMinutes = (duration: string) => {
          const parts = duration.match(/(\d+)h\s*(\d+)?m?/);
          if (!parts) return 0;
          return parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
        };
        const scoreA = a.cost * 0.6 + getDurationMinutes(a.duration) * 10;
        const scoreB = b.cost * 0.6 + getDurationMinutes(b.duration) * 10;
        return scoreA - scoreB;
      });
    }
    
    const recommended = sorted[0];
    let reason = '';
    if (preference === 'cheapest') {
      reason = 'Recommended for lowest cost within your budget';
    } else if (preference === 'fastest') {
      reason = 'Recommended for quickest travel time';
    } else {
      reason = 'Best balance of cost and travel time';
    }
    
    // Filter by budget and mark recommended
    const maxTransportBudget = budget * 0.4;
    return sorted.map(option => ({
      ...option,
      isRecommended: option.id === recommended.id && option.cost <= maxTransportBudget,
      reason: option.id === recommended.id && option.cost <= maxTransportBudget ? reason : undefined,
    }));
  };

  // Use real-time data when available, fallback to generated data
  const displayWeather = realTimeWeather || travelPlan.weather;
  const displayAttractions = realTimeAttractions.length > 0 ? realTimeAttractions : travelPlan.attractions;
  const displayFood = realTimeFood.length > 0 ? realTimeFood : travelPlan.food;
  const displayShopping = realTimeShopping.length > 0 ? realTimeShopping : travelPlan.shopping;
  const displayTransport = realTimeTransport.length > 0 
    ? processTransportOptions(realTimeTransport) 
    : travelPlan.transport;
  
  // Process hotels - mark best value based on rating/price ratio
  const processHotels = (hotelList: HotelOption[]): HotelOption[] => {
    if (hotelList.length === 0) return [];
    
    const bestValue = hotelList.reduce((best, current) => {
      const currentValue = current.rating / current.pricePerNight;
      const bestValueScore = best.rating / best.pricePerNight;
      return currentValue > bestValueScore ? current : best;
    }, hotelList[0]);
    
    return hotelList.map(hotel => ({
      ...hotel,
      isBestValue: hotel.id === bestValue.id,
    }));
  };
  
  const displayHotels = realTimeHotels.length > 0 
    ? processHotels(realTimeHotels) 
    : travelPlan.hotels;

  const { input, budget: budgetBreakdown } = travelPlan;

  const calculateDays = (): number => {
    if (!input.startDate || !input.endDate) return 3;
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/plan')}
                className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modify Search
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Your Trip: {input.source} → {input.destination}
              </h1>
              <p className="text-muted-foreground">
                Budget: ₹{input.budget.toLocaleString()} • {days} day{days > 1 ? 's' : ''} • {input.preference.charAt(0).toUpperCase() + input.preference.slice(1)} mode
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleRefreshAll}
                disabled={isRealTimeLoading || isTransportLoading || isHotelsLoading}
              >
                {(isRealTimeLoading || isTransportLoading || isHotelsLoading) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh Data
              </Button>
              <Button onClick={handleNewPlan} size="sm" className="gap-2 gradient-hero">
                <RefreshCw className="w-4 h-4" />
                New Plan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Transport Section */}
              <section className="animate-slide-up">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  Transport Options
                </h2>
                <div className="space-y-4">
                  {isTransportLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Finding best routes...</span>
                    </div>
                  ) : displayTransport.length > 0 ? (
                    displayTransport.map((option) => (
                      <TransportCard key={option.id} option={option} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No transport options available for this route</p>
                  )}
                </div>
              </section>

              {/* Hotels Section */}
              <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Building className="w-5 h-5 text-purple-500" />
                  </div>
                  Accommodation Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isHotelsLoading ? (
                    <div className="col-span-2 flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Finding best hotels...</span>
                    </div>
                  ) : displayHotels.length > 0 ? (
                    displayHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} nights={days} />
                    ))
                  ) : (
                    <p className="col-span-2 text-muted-foreground text-center py-4">No hotels found for this destination</p>
                  )}
                </div>
              </section>

              {/* Experiences Section */}
              <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <ExperienceSection
                  attractions={displayAttractions}
                  food={displayFood}
                  shopping={displayShopping}
                  destination={input.destination}
                />
              </section>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Weather Widget */}
              <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="relative">
                  {isRealTimeLoading && (
                    <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                  <WeatherWidget weather={displayWeather} destination={input.destination} />
                </div>
              </div>

              {/* Budget Summary */}
              <div className="animate-slide-up sticky top-24" style={{ animationDelay: '0.2s' }}>
                <BudgetSummary budget={budgetBreakdown} totalBudget={input.budget} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
