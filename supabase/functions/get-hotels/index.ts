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

    const apiKey = Deno.env.get('GEOAPIFY_API_KEY');
    
    if (!apiKey) {
      console.error('GEOAPIFY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Geoapify API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching hotels for city: ${city}`);

    // Step 1: Geocode the city using Geoapify Geocoding API
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city + ', India')}&format=json&apiKey=${apiKey}`;
    
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();
    console.log('Geocode response:', JSON.stringify(geoData).substring(0, 200));

    if (!geoData.results || geoData.results.length === 0) {
      console.error('Failed to geocode city');
      return new Response(
        JSON.stringify({ hotels: [], message: 'No hotels found for this location', source: 'geocode_error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cityLocation = {
      lat: geoData.results[0].lat,
      lng: geoData.results[0].lon
    };
    console.log(`City coordinates: ${cityLocation.lat}, ${cityLocation.lng}`);

    // Step 2: Search for hotels using Geoapify Places API
    const hotelsUrl = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${cityLocation.lng},${cityLocation.lat},10000&limit=20&apiKey=${apiKey}`;
    
    const hotelsResponse = await fetch(hotelsUrl);
    const hotelsData = await hotelsResponse.json();
    console.log(`Hotels search found ${hotelsData.features?.length || 0} hotels`);

    if (!hotelsData.features || hotelsData.features.length === 0) {
      console.error('No hotels found from Geoapify');
      return new Response(
        JSON.stringify({ hotels: [], message: 'No hotels found for this location', source: 'no_results' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Different hotel images for variety
    const hotelImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', // Luxury pool
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', // Modern hotel
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', // Resort
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', // Hotel room
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', // Grand hotel
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', // Boutique hotel
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80', // City hotel
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80', // Beachside
    ];

    // Transform results to hotel format
    const hotels: HotelResult[] = hotelsData.features.slice(0, 8).map((feature: any, index: number) => {
      const place = feature.properties;
      const coords = feature.geometry?.coordinates || [cityLocation.lng, cityLocation.lat];
      
      // Use different image for each hotel
      const imageUrl = hotelImages[index % hotelImages.length];

      // Calculate distance from city center
      const hotelLat = coords[1];
      const hotelLng = coords[0];
      const distanceKm = calculateDistance(cityLocation.lat, cityLocation.lng, hotelLat, hotelLng);
      
      // Estimate price and rating based on available data
      const rating = place.datasource?.raw?.stars || (3 + Math.random() * 2);
      const priceLevel = Math.min(4, Math.floor(rating));
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
        name: place.name || `Hotel in ${city}`,
        pricePerNight,
        rating: parseFloat(rating.toFixed(1)),
        distance: `${distanceKm.toFixed(1)} km from center`,
        amenities: amenities.slice(0, 4),
        image: imageUrl,
        address: place.formatted || place.address_line1 || `${city}, India`,
        priceLevel: priceLevelLabel,
      };
    });

    // Filter out hotels without names and sort by rating
    const validHotels = hotels.filter(h => h.name && !h.name.startsWith('Hotel in'));
    const finalHotels = validHotels.length > 0 ? validHotels : hotels;
    finalHotels.sort((a, b) => b.rating - a.rating);

    return new Response(
      JSON.stringify({ hotels: finalHotels, source: 'geoapify' }),
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
