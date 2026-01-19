import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceResult {
  id: string;
  name: string;
  description: string;
  type: 'attraction' | 'food' | 'shopping';
  category?: string;
  image: string;
  rating?: number;
  address?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, type } = await req.json();
    
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

    console.log(`Fetching places for city: ${city}, type: ${type}`);

    // Map our type to Google Places types
    let placeType = 'tourist_attraction';
    let ourType: 'attraction' | 'food' | 'shopping' = 'attraction';
    
    if (type === 'food') {
      placeType = 'restaurant';
      ourType = 'food';
    } else if (type === 'shopping') {
      placeType = 'shopping_mall';
      ourType = 'shopping';
    }

    // First, get city coordinates using Text Search
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city + ' India')}&key=${apiKey}`;
    const geoResponse = await fetch(textSearchUrl);
    const geoData = await geoResponse.json();

    console.log('Geocode response status:', geoData.status, 'error_message:', geoData.error_message);

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      console.error('Failed to geocode city:', geoData.status, geoData.error_message);
      // Return mock places when API fails
      const mockPlaces = generateMockPlaces(city, ourType);
      return new Response(
        JSON.stringify({ places: mockPlaces, source: 'mock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const location = geoData.results[0].geometry.location;
    console.log(`City coordinates: ${location.lat}, ${location.lng}`);

    // Now search for places near the city
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=10000&type=${placeType}&key=${apiKey}`;
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    if (placesData.status !== 'OK') {
      console.error('Places API error:', placesData.status);
      return new Response(
        JSON.stringify({ places: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${placesData.results?.length || 0} places`);

    // Transform results
    const places: PlaceResult[] = (placesData.results || []).slice(0, 6).map((place: any, index: number) => {
      // Get photo URL if available
      let imageUrl = 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400';
      
      if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].photo_reference;
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
      }

      // Determine category based on type
      let category: string | undefined;
      if (ourType === 'food') {
        const types = place.types || [];
        if (types.includes('cafe')) category = 'Café';
        else if (types.includes('bar')) category = 'Bar';
        else if (types.includes('bakery')) category = 'Bakery';
        else category = 'Restaurant';
      }

      return {
        id: `${ourType}-${place.place_id || index}`,
        name: place.name,
        description: place.vicinity || `Popular ${ourType} in ${city}`,
        type: ourType,
        category: category,
        image: imageUrl,
        rating: place.rating,
        address: place.vicinity,
      };
    });

    return new Response(
      JSON.stringify({ places }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-places function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Generate mock places when API fails
function generateMockPlaces(city: string, type: 'attraction' | 'food' | 'shopping'): any[] {
  const attractionNames = ['City Museum', 'Heritage Fort', 'Central Park', 'Temple Complex', 'Lake Garden', 'Art Gallery'];
  const foodNames = ['Spice Garden Restaurant', 'Royal Kitchen', 'Street Food Corner', 'Traditional Thali House', 'Café Central', 'Rooftop Diner'];
  const shoppingNames = ['City Mall', 'Heritage Bazaar', 'Fashion Street', 'Craft Market', 'Shopping Plaza', 'Local Market'];
  
  const names = type === 'attraction' ? attractionNames : type === 'food' ? foodNames : shoppingNames;
  const images = {
    attraction: ['1518684079-3c830dcef090', '1469854523086-cc02fe5d8800', '1506905925346-21bda4d32df4', '1533929736562-6f1c40e6df16', '1476514525535-07fb3b4ae5f1', '1499856871958-5b9627545d1a'],
    food: ['1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5', '1414235077428-338989a2e8c0', '1504674900247-0877df9cc836', '1554118811-1e0d58224f24', '1559339352-11d035aa65de'],
    shopping: ['1441986300917-64674bd600d8', '1481437156560-3205f6a55735', '1472851294608-062f824d29cc', '1555529669-e69e7aa0ba9a', '1534452203293-494d7ddbf7e0', '1483985988355-763728e1935b']
  };

  return names.map((name, i) => ({
    id: `mock-${type}-${i}`,
    name: `${name}`,
    description: `Popular ${type} destination in ${city}`,
    type,
    category: type === 'food' ? 'Restaurant' : undefined,
    image: `https://images.unsplash.com/photo-${images[type][i]}?w=400`,
    rating: 3.5 + Math.random() * 1.5,
    address: `${city} City`,
  }));
}
