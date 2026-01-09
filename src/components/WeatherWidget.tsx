import { Cloud, Sun, CloudRain, CloudSun, Thermometer, Umbrella } from 'lucide-react';
import { WeatherInfo } from '@/types/travel';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  destination: string;
}

const WeatherWidget = ({ weather, destination }: WeatherWidgetProps) => {
  const getWeatherIcon = () => {
    switch (weather.condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-12 h-12 text-amber-500" />;
      case 'partly cloudy':
        return <CloudSun className="w-12 h-12 text-blue-400" />;
      case 'light rain':
        return <CloudRain className="w-12 h-12 text-blue-600" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-400" />;
    }
  };

  const getWeatherGradient = () => {
    switch (weather.condition.toLowerCase()) {
      case 'sunny':
        return 'from-amber-400/20 to-orange-400/10';
      case 'partly cloudy':
        return 'from-blue-400/20 to-sky-400/10';
      case 'light rain':
        return 'from-blue-500/20 to-indigo-400/10';
      default:
        return 'from-blue-300/20 to-teal-300/10';
    }
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${getWeatherGradient()} border border-border shadow-card`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Weather in {destination}</h3>
          <p className="text-muted-foreground">{weather.condition}</p>
        </div>
        <span className="text-4xl">{weather.icon}</span>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-destructive" />
          <span className="text-3xl font-bold text-foreground">{weather.temperature}°C</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-start gap-2">
          <Umbrella className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground">{weather.advice}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
