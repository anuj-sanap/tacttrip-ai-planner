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

    const apiKey = Deno.env.get('GEOAPIFY_API_KEY');
    
    if (!apiKey) {
      console.error('GEOAPIFY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Geoapify API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching places for city: ${city}, type: ${type}`);

    // Step 1: Geocode the city
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city + ', India')}&format=json&apiKey=${apiKey}`;
    
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      console.error('Failed to geocode city');
      return new Response(
        JSON.stringify({ places: [], message: 'No places found for this location', source: 'geocode_error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cityLocation = {
      lat: geoData.results[0].lat,
      lng: geoData.results[0].lon
    };

    // Map our type to Geoapify categories
    let categories = 'tourism.sights,tourism.attraction';
    let ourType: 'attraction' | 'food' | 'shopping' = 'attraction';
    
    if (type === 'food') {
      categories = 'catering.restaurant,catering.cafe';
      ourType = 'food';
    } else if (type === 'shopping') {
      categories = 'commercial.shopping_mall,commercial.marketplace';
      ourType = 'shopping';
    }

    // Step 2: Search for places using Geoapify Places API
    const placesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${cityLocation.lng},${cityLocation.lat},10000&limit=10&apiKey=${apiKey}`;

    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();
    console.log(`Places search found ${placesData.features?.length || 0} places`);

    if (!placesData.features || placesData.features.length === 0) {
      console.error('No places found from Geoapify');
      return new Response(
        JSON.stringify({ places: [], message: 'No places found for this location', source: 'no_results' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Different images for variety based on type
    const attractionImages = [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', // Taj Mahal
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', // India Gate
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400', // Hawa Mahal
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', // Temple
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', // Fort
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', // Palace
    ];
    
    const foodImages = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', // Restaurant interior
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', // Fine dining
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400', // Cafe
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', // Plated food
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', // Indian food
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', // Street food
    ];
    
    const shoppingImages = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', // Mall
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', // Shopping bags
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400', // Storefront
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400', // Bazaar
      'https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=400', // Market
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400', // Retail
    ];

    const imagesByType = {
      attraction: attractionImages,
      food: foodImages,
      shopping: shoppingImages
    };

    // Transform results
    const places: PlaceResult[] = placesData.features.slice(0, 6).map((feature: any, index: number) => {
      const place = feature.properties;

      // Determine category based on type
      let category: string | undefined;
      if (ourType === 'food') {
        const cats = place.categories || [];
        if (cats.some((c: string) => c.includes('cafe'))) category = 'Café';
        else if (cats.some((c: string) => c.includes('bar'))) category = 'Bar';
        else if (cats.some((c: string) => c.includes('bakery'))) category = 'Bakery';
        else category = 'Restaurant';
      }

      return {
        id: `${ourType}-${place.place_id || index}`,
        name: place.name || `${ourType.charAt(0).toUpperCase() + ourType.slice(1)} in ${city}`,
        description: place.formatted || place.address_line1 || `Popular ${ourType} in ${city}`,
        type: ourType,
        category: category,
        image: imagesByType[ourType][index % imagesByType[ourType].length],
        rating: place.datasource?.raw?.rating || (3.5 + Math.random() * 1.5),
        address: place.formatted || place.address_line1,
      };
    });

    // Filter out places without proper names
    const validPlaces = places.filter(p => p.name && !p.name.includes(' in '));
    const finalPlaces = validPlaces.length > 0 ? validPlaces : places;

    return new Response(
      JSON.stringify({ places: finalPlaces, source: 'geoapify' }),
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
