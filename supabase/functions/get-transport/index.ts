import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransportOption {
  id: string;
  type: 'flight' | 'train' | 'bus';
  name: string;
  cost: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  comfort: 'Basic' | 'Standard' | 'Premium';
}

// Distance matrix for major Indian cities (in km, approximate)
const distanceMatrix: Record<string, Record<string, number>> = {
  'mumbai': { 'delhi': 1400, 'bangalore': 980, 'chennai': 1340, 'kolkata': 1990, 'hyderabad': 710, 'pune': 150, 'jaipur': 1150, 'goa': 590, 'ahmedabad': 530, 'kerala': 1100, 'agra': 1200, 'varanasi': 1500, 'udaipur': 650, 'manali': 2000 },
  'delhi': { 'mumbai': 1400, 'bangalore': 2150, 'chennai': 2180, 'kolkata': 1500, 'hyderabad': 1550, 'pune': 1450, 'jaipur': 280, 'goa': 1900, 'ahmedabad': 940, 'kerala': 2700, 'agra': 230, 'varanasi': 820, 'udaipur': 660, 'manali': 550 },
  'bangalore': { 'mumbai': 980, 'delhi': 2150, 'chennai': 350, 'kolkata': 1880, 'hyderabad': 570, 'pune': 840, 'jaipur': 1920, 'goa': 560, 'ahmedabad': 1500, 'kerala': 500, 'agra': 1950, 'varanasi': 1900, 'udaipur': 1400, 'manali': 2700 },
  'chennai': { 'mumbai': 1340, 'delhi': 2180, 'bangalore': 350, 'kolkata': 1670, 'hyderabad': 630, 'pune': 1180, 'jaipur': 1980, 'goa': 860, 'ahmedabad': 1850, 'kerala': 700, 'agra': 2000, 'varanasi': 1800, 'udaipur': 1700, 'manali': 2800 },
  'kolkata': { 'mumbai': 1990, 'delhi': 1500, 'bangalore': 1880, 'chennai': 1670, 'hyderabad': 1500, 'pune': 1880, 'jaipur': 1500, 'goa': 2000, 'ahmedabad': 1900, 'kerala': 2200, 'agra': 1300, 'varanasi': 680, 'udaipur': 1600, 'manali': 1900 },
  'hyderabad': { 'mumbai': 710, 'delhi': 1550, 'bangalore': 570, 'chennai': 630, 'kolkata': 1500, 'pune': 560, 'jaipur': 1350, 'goa': 580, 'ahmedabad': 1100, 'kerala': 900, 'agra': 1400, 'varanasi': 1200, 'udaipur': 1000, 'manali': 2100 },
  'pune': { 'mumbai': 150, 'delhi': 1450, 'bangalore': 840, 'chennai': 1180, 'kolkata': 1880, 'hyderabad': 560, 'jaipur': 1150, 'goa': 450, 'ahmedabad': 660, 'kerala': 980, 'agra': 1250, 'varanasi': 1400, 'udaipur': 750, 'manali': 2000 },
  'jaipur': { 'mumbai': 1150, 'delhi': 280, 'bangalore': 1920, 'chennai': 1980, 'kolkata': 1500, 'hyderabad': 1350, 'pune': 1150, 'goa': 1600, 'ahmedabad': 660, 'kerala': 2400, 'agra': 240, 'varanasi': 800, 'udaipur': 400, 'manali': 750 },
  'goa': { 'mumbai': 590, 'delhi': 1900, 'bangalore': 560, 'chennai': 860, 'kolkata': 2000, 'hyderabad': 580, 'pune': 450, 'jaipur': 1600, 'ahmedabad': 1100, 'kerala': 450, 'agra': 1700, 'varanasi': 1800, 'udaipur': 1100, 'manali': 2400 },
  'ahmedabad': { 'mumbai': 530, 'delhi': 940, 'bangalore': 1500, 'chennai': 1850, 'kolkata': 1900, 'hyderabad': 1100, 'pune': 660, 'jaipur': 660, 'goa': 1100, 'kerala': 1700, 'agra': 750, 'varanasi': 1200, 'udaipur': 260, 'manali': 1400 },
  'kerala': { 'mumbai': 1100, 'delhi': 2700, 'bangalore': 500, 'chennai': 700, 'kolkata': 2200, 'hyderabad': 900, 'pune': 980, 'jaipur': 2400, 'goa': 450, 'ahmedabad': 1700, 'agra': 2500, 'varanasi': 2300, 'udaipur': 1800, 'manali': 3200 },
  'agra': { 'mumbai': 1200, 'delhi': 230, 'bangalore': 1950, 'chennai': 2000, 'kolkata': 1300, 'hyderabad': 1400, 'pune': 1250, 'jaipur': 240, 'goa': 1700, 'ahmedabad': 750, 'kerala': 2500, 'varanasi': 600, 'udaipur': 480, 'manali': 700 },
  'varanasi': { 'mumbai': 1500, 'delhi': 820, 'bangalore': 1900, 'chennai': 1800, 'kolkata': 680, 'hyderabad': 1200, 'pune': 1400, 'jaipur': 800, 'goa': 1800, 'ahmedabad': 1200, 'kerala': 2300, 'agra': 600, 'udaipur': 1000, 'manali': 1300 },
  'udaipur': { 'mumbai': 650, 'delhi': 660, 'bangalore': 1400, 'chennai': 1700, 'kolkata': 1600, 'hyderabad': 1000, 'pune': 750, 'jaipur': 400, 'goa': 1100, 'ahmedabad': 260, 'kerala': 1800, 'agra': 480, 'varanasi': 1000, 'manali': 1100 },
  'manali': { 'mumbai': 2000, 'delhi': 550, 'bangalore': 2700, 'chennai': 2800, 'kolkata': 1900, 'hyderabad': 2100, 'pune': 2000, 'jaipur': 750, 'goa': 2400, 'ahmedabad': 1400, 'kerala': 3200, 'agra': 700, 'varanasi': 1300, 'udaipur': 1100 },
};

// Flight carriers available on routes
const flightCarriers = [
  { name: 'IndiGo', baseCost: 3500, comfort: 'Standard' as const },
  { name: 'Air India', baseCost: 4500, comfort: 'Premium' as const },
  { name: 'SpiceJet', baseCost: 3000, comfort: 'Standard' as const },
  { name: 'Vistara', baseCost: 5000, comfort: 'Premium' as const },
  { name: 'GoFirst', baseCost: 2800, comfort: 'Basic' as const },
];

// Train options
const trainOptions = [
  { name: 'Rajdhani Express', speedFactor: 80, baseCost: 1200, comfort: 'Premium' as const },
  { name: 'Shatabdi Express', speedFactor: 90, baseCost: 1000, comfort: 'Standard' as const },
  { name: 'Duronto Express', speedFactor: 85, baseCost: 1100, comfort: 'Standard' as const },
  { name: 'Garib Rath', speedFactor: 70, baseCost: 600, comfort: 'Basic' as const },
  { name: 'Superfast Express', speedFactor: 65, baseCost: 500, comfort: 'Standard' as const },
];

// Bus operators
const busOperators = [
  { name: 'VRL Travels Volvo', speedFactor: 55, baseCost: 800, comfort: 'Premium' as const },
  { name: 'Orange Travels', speedFactor: 50, baseCost: 600, comfort: 'Standard' as const },
  { name: 'SRS Travels', speedFactor: 50, baseCost: 550, comfort: 'Standard' as const },
  { name: 'Neeta Tours', speedFactor: 55, baseCost: 700, comfort: 'Standard' as const },
  { name: 'State Transport', speedFactor: 45, baseCost: 400, comfort: 'Basic' as const },
];

function normalizeCity(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, '');
}

function getDistance(source: string, destination: string): number {
  const src = normalizeCity(source);
  const dest = normalizeCity(destination);
  
  if (distanceMatrix[src] && distanceMatrix[src][dest]) {
    return distanceMatrix[src][dest];
  }
  
  // Default distance if route not found
  return 800;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function generateDepartureTime(): string {
  const hours = Math.floor(Math.random() * 18) + 5; // 5 AM to 11 PM
  const mins = Math.random() < 0.5 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${mins}`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60) % 24;
  const newMins = totalMins % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function generateTransportOptions(source: string, destination: string): TransportOption[] {
  const distance = getDistance(source, destination);
  const options: TransportOption[] = [];
  
  // Generate flight options (for distances > 300 km)
  if (distance > 300) {
    const numFlights = Math.min(2, Math.floor(Math.random() * 2) + 1);
    const selectedCarriers = flightCarriers.sort(() => Math.random() - 0.5).slice(0, numFlights);
    
    selectedCarriers.forEach((carrier, idx) => {
      const flightDuration = Math.floor(distance / 800 * 60 + 45 + Math.random() * 30); // Approximate flight time
      const cost = Math.round(carrier.baseCost + (distance * 2.5) + Math.random() * 500);
      const departureTime = generateDepartureTime();
      
      options.push({
        id: `flight-${idx + 1}-${Date.now()}`,
        type: 'flight',
        name: carrier.name,
        cost,
        duration: formatDuration(flightDuration),
        departureTime,
        arrivalTime: addMinutesToTime(departureTime, flightDuration),
        comfort: carrier.comfort,
      });
    });
  }
  
  // Generate train options (for distances between 100 and 2000 km)
  if (distance >= 100 && distance <= 2000) {
    const numTrains = Math.min(2, Math.floor(Math.random() * 2) + 1);
    const selectedTrains = trainOptions.sort(() => Math.random() - 0.5).slice(0, numTrains);
    
    selectedTrains.forEach((train, idx) => {
      const trainDuration = Math.floor(distance / train.speedFactor * 60);
      const cost = Math.round(train.baseCost + (distance * 0.8) + Math.random() * 200);
      const departureTime = generateDepartureTime();
      
      options.push({
        id: `train-${idx + 1}-${Date.now()}`,
        type: 'train',
        name: train.name,
        cost,
        duration: formatDuration(trainDuration),
        departureTime,
        arrivalTime: addMinutesToTime(departureTime, trainDuration),
        comfort: train.comfort,
      });
    });
  }
  
  // Generate bus options (for distances < 1500 km)
  if (distance < 1500) {
    const numBuses = Math.min(2, Math.floor(Math.random() * 2) + 1);
    const selectedBuses = busOperators.sort(() => Math.random() - 0.5).slice(0, numBuses);
    
    selectedBuses.forEach((bus, idx) => {
      const busDuration = Math.floor(distance / bus.speedFactor * 60);
      const cost = Math.round(bus.baseCost + (distance * 0.5) + Math.random() * 100);
      const departureTime = generateDepartureTime();
      
      options.push({
        id: `bus-${idx + 1}-${Date.now()}`,
        type: 'bus',
        name: bus.name,
        cost,
        duration: formatDuration(busDuration),
        departureTime,
        arrivalTime: addMinutesToTime(departureTime, busDuration),
        comfort: bus.comfort,
      });
    });
  }
  
  return options;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source, destination } = await req.json();
    
    console.info(`Fetching transport options from ${source} to ${destination}`);
    
    if (!source || !destination) {
      return new Response(
        JSON.stringify({ error: 'Source and destination are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const transportOptions = generateTransportOptions(source, destination);
    const distance = getDistance(source, destination);
    
    console.info(`Generated ${transportOptions.length} transport options for ${distance}km route`);

    return new Response(
      JSON.stringify({ 
        options: transportOptions,
        route: { source, destination, distance }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating transport options:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
