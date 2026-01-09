import { Plane, Train, Bus, Clock, Star, Sparkles, Check } from 'lucide-react';
import { TransportOption } from '@/types/travel';

interface TransportCardProps {
  option: TransportOption;
}

const TransportCard = ({ option }: TransportCardProps) => {
  const getIcon = () => {
    switch (option.type) {
      case 'flight':
        return <Plane className="w-6 h-6" />;
      case 'train':
        return <Train className="w-6 h-6" />;
      case 'bus':
        return <Bus className="w-6 h-6" />;
    }
  };

  const getTypeColor = () => {
    switch (option.type) {
      case 'flight':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'train':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'bus':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
    }
  };

  const getComfortStars = () => {
    const levels = { Basic: 1, Standard: 2, Premium: 3 };
    return levels[option.comfort] || 2;
  };

  return (
    <div
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-300 bg-card
        ${option.isRecommended 
          ? 'border-primary shadow-card-hover ring-2 ring-primary/20' 
          : 'border-border shadow-card hover:shadow-card-hover hover:border-primary/30'
        }
      `}
    >
      {/* Recommended Badge */}
      {option.isRecommended && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Recommended
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon and Info */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border ${getTypeColor()}`}>
            {getIcon()}
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">{option.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{option.type}</p>
            
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {option.duration}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {option.departureTime} → {option.arrivalTime}
              </span>
            </div>

            {/* Comfort Level */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < getComfortStars() ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">{option.comfort}</span>
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">₹{option.cost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">per person</p>
        </div>
      </div>

      {/* Recommendation Reason */}
      {option.isRecommended && option.reason && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-primary flex items-center gap-2">
            <Check className="w-4 h-4" />
            {option.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransportCard;
