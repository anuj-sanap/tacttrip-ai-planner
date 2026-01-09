import { TransportOption, HotelOption, Attraction, WeatherInfo } from '@/types/travel';

export const transportOptions: Record<string, TransportOption[]> = {
  default: [
    {
      id: 'flight-1',
      type: 'flight',
      name: 'IndiGo Airlines',
      cost: 4500,
      duration: '2h 15m',
      departureTime: '06:30',
      arrivalTime: '08:45',
      comfort: 'Standard',
    },
    {
      id: 'flight-2',
      type: 'flight',
      name: 'Air India Express',
      cost: 5200,
      duration: '2h 30m',
      departureTime: '10:00',
      arrivalTime: '12:30',
      comfort: 'Premium',
    },
    {
      id: 'train-1',
      type: 'train',
      name: 'Rajdhani Express',
      cost: 1800,
      duration: '8h 30m',
      departureTime: '16:00',
      arrivalTime: '00:30',
      comfort: 'Standard',
    },
    {
      id: 'train-2',
      type: 'train',
      name: 'Shatabdi Express',
      cost: 1200,
      duration: '6h 45m',
      departureTime: '06:00',
      arrivalTime: '12:45',
      comfort: 'Standard',
    },
    {
      id: 'bus-1',
      type: 'bus',
      name: 'VRL Travels Volvo',
      cost: 800,
      duration: '10h 00m',
      departureTime: '21:00',
      arrivalTime: '07:00',
      comfort: 'Standard',
    },
    {
      id: 'bus-2',
      type: 'bus',
      name: 'Orange Travels',
      cost: 600,
      duration: '12h 00m',
      departureTime: '20:00',
      arrivalTime: '08:00',
      comfort: 'Basic',
    },
  ],
};

export const hotelOptions: Record<string, HotelOption[]> = {
  default: [
    {
      id: 'hotel-1',
      name: 'The Grand Heritage',
      pricePerNight: 4500,
      rating: 4.5,
      distance: '0.5 km from center',
      amenities: ['WiFi', 'Breakfast', 'Pool', 'Spa'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 'hotel-2',
      name: 'City Comfort Inn',
      pricePerNight: 2200,
      rating: 4.0,
      distance: '1.2 km from center',
      amenities: ['WiFi', 'Breakfast', 'Parking'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    },
    {
      id: 'hotel-3',
      name: 'Budget Stay Plus',
      pricePerNight: 1200,
      rating: 3.5,
      distance: '2.5 km from center',
      amenities: ['WiFi', 'AC', 'TV'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
    },
    {
      id: 'hotel-4',
      name: 'Backpacker Hostel',
      pricePerNight: 600,
      rating: 3.2,
      distance: '3 km from center',
      amenities: ['WiFi', 'Shared Kitchen'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    },
  ],
};

export const attractionsData: Record<string, Attraction[]> = {
  default: [
    {
      id: 'attr-1',
      name: 'Historic Fort & Palace',
      description: 'A magnificent 16th-century fort with stunning architecture and panoramic city views.',
      type: 'attraction',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    },
    {
      id: 'attr-2',
      name: 'Botanical Gardens',
      description: 'Sprawling gardens featuring exotic plants, scenic walking paths, and peaceful lakes.',
      type: 'attraction',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
    },
    {
      id: 'attr-3',
      name: 'Cultural Museum',
      description: 'World-class museum showcasing local art, history, and cultural heritage.',
      type: 'attraction',
      image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
    },
  ],
};

export const foodData: Record<string, Attraction[]> = {
  default: [
    {
      id: 'food-1',
      name: 'Street Food Corner',
      description: 'Famous for authentic local street food - chaats, samosas, and fresh juices.',
      type: 'food',
      category: 'Street Food',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    },
    {
      id: 'food-2',
      name: 'Spice Garden Restaurant',
      description: 'Fine dining with traditional recipes passed down through generations.',
      type: 'food',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    },
    {
      id: 'food-3',
      name: 'Rooftop Café Vista',
      description: 'Trendy café with fusion cuisine and breathtaking sunset views.',
      type: 'food',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    },
  ],
};

export const shoppingData: Record<string, Attraction[]> = {
  default: [
    {
      id: 'shop-1',
      name: 'Heritage Bazaar',
      description: 'Traditional market famous for handicrafts, textiles, and authentic souvenirs.',
      type: 'shopping',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
    },
    {
      id: 'shop-2',
      name: 'City Central Mall',
      description: 'Modern shopping destination with international brands and entertainment.',
      type: 'shopping',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400',
    },
  ],
};

export const weatherConditions: WeatherInfo[] = [
  {
    condition: 'Sunny',
    temperature: 32,
    icon: '☀️',
    advice: 'Perfect weather for outdoor sightseeing! Carry sunscreen and stay hydrated.',
  },
  {
    condition: 'Partly Cloudy',
    temperature: 28,
    icon: '⛅',
    advice: 'Great weather for exploring! Comfortable temperature for walking tours.',
  },
  {
    condition: 'Light Rain',
    temperature: 24,
    icon: '🌧️',
    advice: 'Carry an umbrella. Good time to visit indoor attractions and museums.',
  },
  {
    condition: 'Pleasant',
    temperature: 26,
    icon: '🌤️',
    advice: 'Ideal weather conditions for all activities. Enjoy your trip!',
  },
];

export const getRandomWeather = (): WeatherInfo => {
  return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
};

export const popularDestinations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Jaipur',
  'Goa',
  'Kerala',
  'Agra',
  'Varanasi',
  'Udaipur',
  'Manali',
];

export const popularSources = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];
