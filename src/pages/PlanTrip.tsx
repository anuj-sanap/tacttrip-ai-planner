import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import TravelForm from '@/components/TravelForm';
import LoadingState from '@/components/LoadingState';
import { TravelInput } from '@/types/travel';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: TravelInput) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Store data in sessionStorage for the dashboard
      sessionStorage.setItem('travelInput', JSON.stringify(data));
      navigate('/dashboard');
    }, 2500);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Plan Your Perfect Trip
              </h1>
              <p className="text-muted-foreground">
                Tell us about your travel plans and budget. Our AI will create a personalized itinerary just for you.
              </p>
            </div>

            {/* Form Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-card">
              <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="font-semibold text-foreground mb-2">💡 Planning Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set a realistic budget that includes all expenses</li>
                <li>• Choose "Balanced" for the best value recommendations</li>
                <li>• Dates are optional but help calculate accurate costs</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanTrip;
