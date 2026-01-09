import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Wallet, Zap, Scale, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelInput } from '@/types/travel';
import { popularDestinations, popularSources } from '@/data/mockData';

interface TravelFormProps {
  onSubmit: (data: TravelInput) => void;
  isLoading?: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [formData, setFormData] = useState<TravelInput>({
    budget: 15000,
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    preference: 'balanced',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TravelInput, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TravelInput, string>> = {};

    if (!formData.budget || formData.budget < 1000) {
      newErrors.budget = 'Minimum budget is ₹1,000';
    }
    if (!formData.source.trim()) {
      newErrors.source = 'Source city is required';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination city is required';
    }
    if (formData.source.toLowerCase() === formData.destination.toLowerCase()) {
      newErrors.destination = 'Destination must be different from source';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const preferenceOptions = [
    { value: 'cheapest', label: 'Cheapest', icon: Wallet, description: 'Prioritize lowest cost' },
    { value: 'fastest', label: 'Fastest', icon: Zap, description: 'Prioritize travel time' },
    { value: 'balanced', label: 'Balanced', icon: Scale, description: 'Best value for money' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget Input */}
      <div className="space-y-2">
        <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="w-4 h-4 text-primary" />
          Total Budget (₹)
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
          <Input
            id="budget"
            type="number"
            placeholder="15000"
            value={formData.budget || ''}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            className="pl-8 h-12 text-lg"
            min={1000}
          />
        </div>
        {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
        <p className="text-xs text-muted-foreground">Minimum budget: ₹1,000</p>
      </div>

      {/* Source and Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source" className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-success" />
            From (Source City)
          </Label>
          <Input
            id="source"
            placeholder="e.g., Mumbai"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="h-12"
            list="source-cities"
          />
          <datalist id="source-cities">
            {popularSources.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.source && <p className="text-sm text-destructive">{errors.source}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-destructive" />
            To (Destination City)
          </Label>
          <Input
            id="destination"
            placeholder="e.g., Goa"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="h-12"
            list="destination-cities"
          />
          <datalist id="destination-cities">
            {popularDestinations.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
        </div>
      </div>

      {/* Travel Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Start Date (Optional)
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="h-12"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            End Date (Optional)
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="h-12"
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Travel Preference */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Travel Preference</Label>
        <div className="grid grid-cols-3 gap-3">
          {preferenceOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.preference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, preference: option.value as TravelInput['preference'] })}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                  }
                `}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="w-full h-14 text-lg font-semibold gradient-hero hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Generating Plan...
          </span>
        ) : (
          'Generate AI Travel Plan'
        )}
      </Button>
    </form>
  );
};

export default TravelForm;
