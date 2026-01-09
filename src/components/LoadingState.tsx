import { Loader2, Plane, Map, Building, Sparkles } from 'lucide-react';

const LoadingState = () => {
  const steps = [
    { icon: Map, text: 'Analyzing your travel route...' },
    { icon: Plane, text: 'Finding best transport options...' },
    { icon: Building, text: 'Searching for accommodations...' },
    { icon: Sparkles, text: 'Generating AI recommendations...' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        {/* Animated Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full gradient-hero opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full gradient-hero opacity-40 animate-pulse" />
          <div className="absolute inset-4 rounded-full gradient-hero flex items-center justify-center">
            <Plane className="w-8 h-8 text-primary-foreground animate-bounce-gentle" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Creating Your Travel Plan</h2>
        <p className="text-muted-foreground mb-8">
          Our AI is analyzing your preferences to find the perfect trip...
        </p>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-foreground">{step.text}</span>
                {index === 3 && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Loading Bar */}
        <div className="mt-8 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full gradient-hero animate-pulse"
            style={{ 
              width: '60%',
              animation: 'loading 2s ease-in-out infinite',
            }}
          />
        </div>

        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingState;
