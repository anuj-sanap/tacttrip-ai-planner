import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      console.error('OPENWEATHERMAP_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Weather API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for city: ${city}`);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeatherMap API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch weather data' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Weather data received:', JSON.stringify(data));

    // Map OpenWeatherMap conditions to our format
    const condition = data.weather?.[0]?.main || 'Unknown';
    const description = data.weather?.[0]?.description || '';
    const temperature = Math.round(data.main?.temp || 0);
    
    // Generate weather icon and advice
    let icon = '🌤️';
    let advice = 'Enjoy your trip!';
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      icon = '☀️';
      advice = 'Perfect weather for outdoor sightseeing! Carry sunscreen and stay hydrated.';
    } else if (conditionLower.includes('cloud')) {
      icon = '⛅';
      advice = 'Great weather for exploring! Comfortable temperature for walking tours.';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      icon = '🌧️';
      advice = 'Carry an umbrella. Good time to visit indoor attractions and museums.';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      icon = '⛈️';
      advice = 'Stay indoors if possible. Check local attractions for indoor options.';
    } else if (conditionLower.includes('snow')) {
      icon = '❄️';
      advice = 'Bundle up warm! Great weather for winter activities.';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      icon = '🌫️';
      advice = 'Low visibility expected. Take care while traveling.';
    }

    const weatherInfo = {
      condition: condition,
      description: description,
      temperature: temperature,
      icon: icon,
      advice: advice,
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed,
    };

    return new Response(
      JSON.stringify(weatherInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
