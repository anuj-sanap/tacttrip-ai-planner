import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HotelOption } from '@/types/travel';
import { toast } from 'sonner';

interface HotelData {
  hotels: HotelOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useHotelData = (destination: string): HotelData => {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!destination) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('get-hotels', {
        body: { city: destination }
      });

      if (fetchError) {
        console.error('Hotel fetch error:', fetchError);
        setError('Failed to fetch hotel options');
        toast.error('Could not fetch hotel recommendations');
        return;
      }

      if (data?.hotels && data.hotels.length > 0) {
        setHotels(data.hotels);
        console.log(`Fetched ${data.hotels.length} hotels for ${destination}`);
      } else {
        console.log('No hotel data received, using fallback');
        setError('No hotels found');
      }
    } catch (err) {
      console.error('Error fetching hotel data:', err);
      setError('Failed to fetch hotel recommendations');
      toast.error('Could not fetch hotel recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    hotels,
    isLoading,
    error,
    refetch: fetchData,
  };
};
