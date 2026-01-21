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

    // Map our type to search queries
    let searchQuery = `tourist attractions in ${city} India`;
    let ourType: 'attraction' | 'food' | 'shopping' = 'attraction';
    
    if (type === 'food') {
      searchQuery = `restaurants in ${city} India`;
      ourType = 'food';
    } else if (type === 'shopping') {
      searchQuery = `shopping malls in ${city} India`;
      ourType = 'shopping';
    }

    // Use legacy Places API - Text Search
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    const placesResponse = await fetch(textSearchUrl);
    const placesData = await placesResponse.json();
    console.log(`Places search status: ${placesData.status}, found ${placesData.results?.length || 0} places`);

    if (placesData.status !== 'OK' || !placesData.results || placesData.results.length === 0) {
      console.error('No places found:', placesData.status, placesData.error_message);
      return new Response(
        JSON.stringify({ places: [], message: 'No places found for this location', source: 'no_results' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform results
    const places: PlaceResult[] = placesData.results.slice(0, 6).map((place: any, index: number) => {
      // Get photo URL using legacy Places Photos API
      let imageUrl = 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400';
      
      if (place.photos && place.photos.length > 0) {
        const photoReference = place.photos[0].photo_reference;
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
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
        description: place.formatted_address || `Popular ${ourType} in ${city}`,
        type: ourType,
        category: category,
        image: imageUrl,
        rating: place.rating,
        address: place.formatted_address || place.vicinity,
      };
    });

    return new Response(
      JSON.stringify({ places, source: 'google' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-places function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, places: [], message: 'No places found for this location' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
