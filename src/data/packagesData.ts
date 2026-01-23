export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  duration: {
    nights: number;
    days: number;
  };
  price: number;
  originalPrice?: number;
  image: string;
  highlights: string[];
  inclusions: {
    hotel: string;
    transport: string;
    meals: string;
    sightseeing: string[];
  };
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  rating: number;
  reviewCount: number;
  category: 'beach' | 'hill' | 'heritage' | 'adventure' | 'spiritual';
}

export const travelPackages: TravelPackage[] = [
  {
    id: 'pkg-goa-beach',
    name: 'Goa Beach Getaway',
    destination: 'Goa',
    duration: { nights: 3, days: 4 },
    price: 12999,
    originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    highlights: ['Beachside Resort', 'Water Sports', 'Nightlife Experience', 'Spice Plantation Tour'],
    inclusions: {
      hotel: '3-Star Beachside Resort',
      transport: 'Airport Transfers + Local Sightseeing',
      meals: 'Breakfast Included',
      sightseeing: ['Baga Beach', 'Calangute Beach', 'Fort Aguada', 'Basilica of Bom Jesus']
    },
    itinerary: [
      { day: 1, title: 'Arrival & Beach Vibes', description: 'Arrive at Goa airport, transfer to hotel. Evening at Calangute Beach.' },
      { day: 2, title: 'North Goa Exploration', description: 'Visit Fort Aguada, Baga Beach, enjoy water sports.' },
      { day: 3, title: 'Heritage & Spices', description: 'Explore Old Goa churches, spice plantation tour.' },
      { day: 4, title: 'Departure', description: 'Breakfast and transfer to airport.' }
    ],
    rating: 4.5,
    reviewCount: 324,
    category: 'beach'
  },
  {
    id: 'pkg-jaipur-heritage',
    name: 'Royal Jaipur Experience',
    destination: 'Jaipur',
    duration: { nights: 2, days: 3 },
    price: 8999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    highlights: ['Palace Tours', 'Elephant Ride', 'Traditional Dinner', 'Shopping Experience'],
    inclusions: {
      hotel: '4-Star Heritage Hotel',
      transport: 'AC Vehicle for Sightseeing',
      meals: 'Breakfast + One Dinner',
      sightseeing: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar']
    },
    itinerary: [
      { day: 1, title: 'Arrival & City Tour', description: 'Arrive in Jaipur, visit Hawa Mahal and local markets.' },
      { day: 2, title: 'Forts & Palaces', description: 'Full day tour of Amber Fort, City Palace, Jantar Mantar.' },
      { day: 3, title: 'Departure', description: 'Morning shopping at Johari Bazaar, departure.' }
    ],
    rating: 4.7,
    reviewCount: 512,
    category: 'heritage'
  },
  {
    id: 'pkg-manali-adventure',
    name: 'Manali Adventure Trip',
    destination: 'Manali',
    duration: { nights: 4, days: 5 },
    price: 15999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    highlights: ['Rohtang Pass', 'River Rafting', 'Solang Valley', 'Camping Experience'],
    inclusions: {
      hotel: 'Mountain View Resort + 1 Night Camp',
      transport: 'Volvo Bus Delhi-Manali + Local Transport',
      meals: 'All Meals Included',
      sightseeing: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali']
    },
    itinerary: [
      { day: 1, title: 'Journey Begins', description: 'Overnight Volvo from Delhi to Manali.' },
      { day: 2, title: 'Arrival & Local Sightseeing', description: 'Check-in, visit Hadimba Temple, Mall Road.' },
      { day: 3, title: 'Solang Valley Adventure', description: 'Paragliding, zorbing, and adventure activities.' },
      { day: 4, title: 'Rohtang Pass Excursion', description: 'Full day trip to Rohtang Pass, snow activities.' },
      { day: 5, title: 'Departure', description: 'Morning free, return journey to Delhi.' }
    ],
    rating: 4.6,
    reviewCount: 289,
    category: 'adventure'
  },
  {
    id: 'pkg-kerala-backwaters',
    name: 'Kerala Backwater Bliss',
    destination: 'Kerala',
    duration: { nights: 4, days: 5 },
    price: 18999,
    originalPrice: 24999,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    highlights: ['Houseboat Stay', 'Ayurvedic Spa', 'Tea Gardens', 'Beach Sunset'],
    inclusions: {
      hotel: 'Resort + 1 Night Houseboat',
      transport: 'AC Vehicle Throughout',
      meals: 'All Meals on Houseboat',
      sightseeing: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Kovalam Beach', 'Fort Kochi']
    },
    itinerary: [
      { day: 1, title: 'Arrival at Kochi', description: 'Arrive at Cochin airport, explore Fort Kochi.' },
      { day: 2, title: 'Munnar Hills', description: 'Drive to Munnar, tea garden visit, spice plantation.' },
      { day: 3, title: 'Alleppey Houseboat', description: 'Transfer to Alleppey, overnight houseboat cruise.' },
      { day: 4, title: 'Beach Day', description: 'Drive to Kovalam, beach relaxation, Ayurvedic massage.' },
      { day: 5, title: 'Departure', description: 'Transfer to Trivandrum airport.' }
    ],
    rating: 4.8,
    reviewCount: 445,
    category: 'beach'
  },
  {
    id: 'pkg-varanasi-spiritual',
    name: 'Varanasi Spiritual Journey',
    destination: 'Varanasi',
    duration: { nights: 2, days: 3 },
    price: 7499,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
    highlights: ['Ganga Aarti', 'Boat Ride', 'Temple Tours', 'Sarnath Excursion'],
    inclusions: {
      hotel: '3-Star Hotel near Ghats',
      transport: 'Airport Transfers + Boat Ride',
      meals: 'Breakfast Included',
      sightseeing: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Morning Boat Ride']
    },
    itinerary: [
      { day: 1, title: 'Arrival & Evening Aarti', description: 'Arrive in Varanasi, witness the famous Ganga Aarti.' },
      { day: 2, title: 'Temples & Sarnath', description: 'Morning boat ride, temple visits, Sarnath excursion.' },
      { day: 3, title: 'Departure', description: 'Early morning boat ride, breakfast, departure.' }
    ],
    rating: 4.4,
    reviewCount: 267,
    category: 'spiritual'
  },
  {
    id: 'pkg-udaipur-romance',
    name: 'Romantic Udaipur Escape',
    destination: 'Udaipur',
    duration: { nights: 3, days: 4 },
    price: 14999,
    originalPrice: 18999,
    image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=600&q=80',
    highlights: ['Lake Palace View', 'Sunset Boat Ride', 'Cultural Show', 'Royal Dining'],
    inclusions: {
      hotel: 'Lake View Heritage Hotel',
      transport: 'AC Vehicle + Boat Ride',
      meals: 'Breakfast + Candlelight Dinner',
      sightseeing: ['City Palace', 'Lake Pichola', 'Jagdish Temple', 'Saheliyon Ki Bari']
    },
    itinerary: [
      { day: 1, title: 'Arrival at Lake City', description: 'Arrive in Udaipur, sunset at Fateh Sagar Lake.' },
      { day: 2, title: 'Palace Exploration', description: 'City Palace tour, boat ride to Jag Mandir.' },
      { day: 3, title: 'Cultural Immersion', description: 'Gardens tour, cultural show, candlelight dinner.' },
      { day: 4, title: 'Departure', description: 'Morning free for shopping, departure.' }
    ],
    rating: 4.9,
    reviewCount: 198,
    category: 'heritage'
  }
];

export const getPackageById = (id: string): TravelPackage | undefined => {
  return travelPackages.find(pkg => pkg.id === id);
};

export const getPackagesByCategory = (category: TravelPackage['category']): TravelPackage[] => {
  return travelPackages.filter(pkg => pkg.category === category);
};
