import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HotelResult {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  distance: string;
  amenities: string[];
  image: string;
  address?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city } = await req.json();
    
    if (!city) {
      return new Response(
        JSON.stringify({ error: 'City is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Places API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching hotels for city: ${city}`);

    // Use Places API (New) - Text Search
    const textSearchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const textSearchBody = {
      textQuery: `${city} India`,
      maxResultCount: 1
    };

    const geoResponse = await fetch(textSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.location,places.displayName'
      },
      body: JSON.stringify(textSearchBody)
    });
    
    const geoData = await geoResponse.json();
    console.log('Geocode response:', JSON.stringify(geoData));

    if (!geoData.places?.[0]?.location) {
      console.error('Failed to geocode city:', JSON.stringify(geoData));
      const mockHotels = generateMockHotels(city);
      return new Response(
        JSON.stringify({ hotels: mockHotels, source: 'mock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cityLocation = geoData.places[0].location;
    console.log(`City coordinates: ${cityLocation.latitude}, ${cityLocation.longitude}`);

    // Search for hotels using Places API (New) - Text Search
    const hotelsSearchBody = {
      textQuery: `hotels in ${city} India`,
      maxResultCount: 10
    };

    const hotelsResponse = await fetch(textSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.location,places.formattedAddress,places.photos,places.priceLevel'
      },
      body: JSON.stringify(hotelsSearchBody)
    });

    const hotelsData = await hotelsResponse.json();
    console.log(`Found ${hotelsData.places?.length || 0} hotels`);

    if (!hotelsData.places || hotelsData.places.length === 0) {
      console.error('No hotels found:', JSON.stringify(hotelsData));
      const mockHotels = generateMockHotels(city);
      return new Response(
        JSON.stringify({ hotels: mockHotels, source: 'mock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform results to hotel format
    const hotels: HotelResult[] = hotelsData.places.slice(0, 6).map((place: any, index: number) => {
      // Get photo URL if available
      let imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
      
      if (place.photos && place.photos.length > 0) {
        const photoName = place.photos[0].name;
        imageUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${apiKey}`;
      }

      // Calculate distance from city center
      const hotelLat = place.location?.latitude || cityLocation.latitude;
      const hotelLng = place.location?.longitude || cityLocation.longitude;
      const distanceKm = calculateDistance(cityLocation.latitude, cityLocation.longitude, hotelLat, hotelLng);
      
      // Estimate price based on rating and price_level
      const priceLevelMap: Record<string, number> = {
        'PRICE_LEVEL_FREE': 0,
        'PRICE_LEVEL_INEXPENSIVE': 1,
        'PRICE_LEVEL_MODERATE': 2,
        'PRICE_LEVEL_EXPENSIVE': 3,
        'PRICE_LEVEL_VERY_EXPENSIVE': 4
      };
      const priceLevel = priceLevelMap[place.priceLevel] ?? 2;
      const rating = place.rating || 3.5;
      const basePrice = 1500 + (priceLevel * 1500) + (rating * 200);
      const pricePerNight = Math.round(basePrice + Math.random() * 500);

      // Determine amenities based on rating and price
      const amenities: string[] = ['WiFi'];
      if (rating >= 4) amenities.push('Breakfast');
      if (priceLevel >= 3) amenities.push('Pool', 'Spa');
      if (priceLevel >= 2) amenities.push('Parking');
      if (rating >= 4.5) amenities.push('Gym');

      return {
        id: `hotel-${place.id || index}`,
        name: place.displayName?.text || `Hotel ${index + 1}`,
        pricePerNight,
        rating: rating || 3.5,
        distance: `${distanceKm.toFixed(1)} km from center`,
        amenities: amenities.slice(0, 4),
        image: imageUrl,
        address: place.formattedAddress,
      };
    });

    // Sort by rating
    hotels.sort((a, b) => b.rating - a.rating);

    return new Response(
      JSON.stringify({ hotels, source: 'google' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-hotels function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Generate mock hotels when API fails
function generateMockHotels(city: string): any[] {
  const hotelPrefixes = ['Grand', 'Royal', 'The', 'Hotel', 'Taj', 'ITC', 'Oberoi'];
  const hotelSuffixes = ['Palace', 'Resort', 'Inn', 'Suites', 'Residency', 'Plaza', 'Continental'];
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock-hotel-${i}`,
    name: `${hotelPrefixes[i % hotelPrefixes.length]} ${city} ${hotelSuffixes[i % hotelSuffixes.length]}`,
    pricePerNight: 2500 + Math.floor(Math.random() * 5000),
    rating: 3.5 + Math.random() * 1.5,
    distance: `${(1 + Math.random() * 8).toFixed(1)} km from center`,
    amenities: ['WiFi', 'Breakfast', 'Parking', 'AC'].slice(0, 2 + i % 3),
    image: `https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1520250497591-112f2f40a3f4', '1582719508461-905c673771fd', '1551882547-ff40c63fe5fa', '1542314831-068cd1dbfeeb'][i]}?w=400`,
    address: `${city} City Center`,
  }));
}