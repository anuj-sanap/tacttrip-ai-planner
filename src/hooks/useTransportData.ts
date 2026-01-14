import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TransportOption } from '@/types/travel';
import { toast } from 'sonner';

interface TransportData {
  transport: TransportOption[];
  route: { source: string; destination: string; distance: number } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTransportData = (source: string, destination: string): TransportData => {
  const [transport, setTransport] = useState<TransportOption[]>([]);
  const [route, setRoute] = useState<{ source: string; destination: string; distance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!source || !destination) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('get-transport', {
        body: { source, destination }
      });

      if (fetchError) {
        console.error('Transport fetch error:', fetchError);
        setError('Failed to fetch transport options');
        toast.error('Could not fetch transport options');
        return;
      }

      if (data?.options) {
        setTransport(data.options);
        setRoute(data.route);
        console.log(`Fetched ${data.options.length} transport options for ${source} to ${destination}`);
      } else {
        console.error('No transport data received');
        setError('No transport options available');
      }
    } catch (err) {
      console.error('Error fetching transport data:', err);
      setError('Failed to fetch transport options');
      toast.error('Could not fetch transport options');
    } finally {
      setIsLoading(false);
    }
  }, [source, destination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transport,
    route,
    isLoading,
    error,
    refetch: fetchData,
  };
};
