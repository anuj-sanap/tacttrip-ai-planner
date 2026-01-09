import { 
  TravelInput, 
  TransportOption, 
  HotelOption, 
  BudgetBreakdown,
  TravelPlan 
} from '@/types/travel';
import { 
  transportOptions, 
  hotelOptions, 
  attractionsData, 
  foodData, 
  shoppingData, 
  getRandomWeather 
} from '@/data/mockData';

const calculateDays = (startDate?: string, endDate?: string): number => {
  if (!startDate || !endDate) return 3; // Default 3 days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

const selectBestTransport = (
  options: TransportOption[],
  preference: TravelInput['preference'],
  budget: number
): TransportOption[] => {
  const sorted = [...options];

  // Sort based on preference
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
    // Balanced: Score based on cost and time
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

  // Mark best option
  const recommended = sorted[0];
  
  let reason = '';
  if (preference === 'cheapest') {
    reason = 'Recommended for lowest cost within your budget';
  } else if (preference === 'fastest') {
    reason = 'Recommended for quickest travel time';
  } else {
    reason = 'Best balance of cost and travel time';
  }

  // Filter by budget - transport should be max 40% of total budget
  const maxTransportBudget = budget * 0.4;
  const affordable = sorted.filter(t => t.cost <= maxTransportBudget);

  // Return one of each type if possible, with recommendation
  const types = ['flight', 'train', 'bus'] as const;
  const result: TransportOption[] = [];

  types.forEach(type => {
    const option = affordable.find(t => t.type === type) || sorted.find(t => t.type === type);
    if (option) {
      result.push({
        ...option,
        isRecommended: option.id === recommended.id,
        reason: option.id === recommended.id ? reason : undefined,
      });
    }
  });

  return result;
};

const selectBestHotels = (
  options: HotelOption[],
  budget: number,
  days: number,
  transportCost: number
): HotelOption[] => {
  // Available budget for hotels (considering transport and daily expenses)
  const remainingBudget = budget - transportCost;
  const maxHotelBudget = remainingBudget * 0.6; // 60% of remaining for hotels
  const maxPerNight = maxHotelBudget / days;

  // Sort by value (rating/price ratio)
  const sorted = [...options].sort((a, b) => {
    const valueA = a.rating / a.pricePerNight;
    const valueB = b.rating / b.pricePerNight;
    return valueB - valueA;
  });

  // Filter affordable options
  const affordable = sorted.filter(h => h.pricePerNight <= maxPerNight);
  
  // If no affordable options, show cheapest ones
  const finalOptions = affordable.length >= 2 ? affordable : sorted.slice(0, 4);

  // Mark best value
  const bestValue = finalOptions.reduce((best, current) => {
    const currentValue = current.rating / current.pricePerNight;
    const bestValueScore = best.rating / best.pricePerNight;
    return currentValue > bestValueScore ? current : best;
  }, finalOptions[0]);

  return finalOptions.map(hotel => ({
    ...hotel,
    isBestValue: hotel.id === bestValue.id,
  }));
};

const calculateBudget = (
  input: TravelInput,
  transportCost: number,
  hotelPerNight: number,
  days: number
): BudgetBreakdown => {
  const hotelTotal = hotelPerNight * days;
  const dailyExpense = Math.min(1500, (input.budget - transportCost - hotelTotal) / days);
  const totalExpenses = dailyExpense * days;
  const totalEstimated = transportCost + hotelTotal + totalExpenses;
  const remaining = input.budget - totalEstimated;
  const utilizationPercent = Math.min(100, (totalEstimated / input.budget) * 100);

  return {
    transport: transportCost,
    hotel: hotelTotal,
    dailyExpense,
    totalDays: days,
    totalEstimated,
    remaining: Math.max(0, remaining),
    utilizationPercent,
    isWithinBudget: remaining >= 0,
  };
};

export const generateTravelPlan = (input: TravelInput): TravelPlan => {
  const days = calculateDays(input.startDate, input.endDate);
  
  // Get transport options
  const allTransport = transportOptions.default;
  const selectedTransport = selectBestTransport(allTransport, input.preference, input.budget);
  
  // Get recommended transport cost
  const recommendedTransport = selectedTransport.find(t => t.isRecommended) || selectedTransport[0];
  const transportCost = recommendedTransport.cost;

  // Get hotel options
  const allHotels = hotelOptions.default;
  const selectedHotels = selectBestHotels(allHotels, input.budget, days, transportCost);
  
  // Get recommended hotel cost
  const recommendedHotel = selectedHotels.find(h => h.isBestValue) || selectedHotels[0];
  const hotelCost = recommendedHotel.pricePerNight;

  // Calculate budget
  const budgetBreakdown = calculateBudget(input, transportCost, hotelCost, days);

  // Get experiences
  const attractions = attractionsData.default;
  const food = foodData.default;
  const shopping = shoppingData.default;

  // Get weather
  const weather = getRandomWeather();

  return {
    input,
    transport: selectedTransport,
    hotels: selectedHotels,
    attractions,
    food,
    shopping,
    weather,
    budget: budgetBreakdown,
  };
};
