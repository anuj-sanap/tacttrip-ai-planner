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
  priceLevel?: string;
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

    // Step 1: Geocode the city using legacy Places API Text Search
    const geocodeUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city + ' India')}&key=${apiKey}`;
    
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();
    console.log('Geocode response status:', geoData.status);

    if (geoData.status !== 'OK' || !geoData.results?.[0]?.geometry?.location) {
      console.error('Failed to geocode city:', geoData.status, geoData.error_message);
      return new Response(
        JSON.stringify({ hotels: [], message: 'No hotels found for this location', source: 'api_error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cityLocation = geoData.results[0].geometry.location;
    console.log(`City coordinates: ${cityLocation.lat}, ${cityLocation.lng}`);

    // Step 2: Search for hotels using legacy Places API Text Search
    const hotelsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent('hotels in ' + city + ' India')}&type=lodging&key=${apiKey}`;
    
    const hotelsResponse = await fetch(hotelsUrl);
    const hotelsData = await hotelsResponse.json();
    console.log(`Hotels search status: ${hotelsData.status}, found ${hotelsData.results?.length || 0} hotels`);

    if (hotelsData.status !== 'OK' || !hotelsData.results || hotelsData.results.length === 0) {
      console.error('No hotels found:', hotelsData.status, hotelsData.error_message);
      return new Response(
        JSON.stringify({ hotels: [], message: 'No hotels found for this location', source: 'no_results' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform results to hotel format
    const hotels: HotelResult[] = hotelsData.results.slice(0, 8).map((place: any, index: number) => {
      // Get photo URL using legacy Places Photos API
      let imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
      
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
      }

      // Calculate distance from city center
      const hotelLat = place.geometry?.location?.lat || cityLocation.lat;
      const hotelLng = place.geometry?.location?.lng || cityLocation.lng;
      const distanceKm = calculateDistance(cityLocation.lat, cityLocation.lng, hotelLat, hotelLng);
      
      // Estimate price based on rating and price_level
      const priceLevel = place.price_level ?? 2;
      const rating = place.rating || 3.5;
      const basePrice = 1500 + (priceLevel * 1500) + (rating * 200);
      const pricePerNight = Math.round(basePrice + Math.random() * 500);

      // Convert price_level to readable format
      const priceLevelLabels = ['Free', 'Budget', 'Moderate', 'Expensive', 'Luxury'];
      const priceLevelLabel = priceLevelLabels[priceLevel] || 'Moderate';

      // Determine amenities based on rating and price
      const amenities: string[] = ['WiFi'];
      if (rating >= 4) amenities.push('Breakfast');
      if (priceLevel >= 3) amenities.push('Pool', 'Spa');
      if (priceLevel >= 2) amenities.push('Parking');
      if (rating >= 4.5) amenities.push('Gym');

      return {
        id: `hotel-${place.place_id || index}`,
        name: place.name,
        pricePerNight,
        rating: rating,
        distance: `${distanceKm.toFixed(1)} km from center`,
        amenities: amenities.slice(0, 4),
        image: imageUrl,
        address: place.formatted_address || place.vicinity,
        priceLevel: priceLevelLabel,
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
      JSON.stringify({ error: errorMessage, hotels: [], message: 'No hotels found for this location' }),
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
