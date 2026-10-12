export interface DisplayEvent {
  id: number;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string;
  endTime?: string | null;
  isActive: boolean;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  weather_text: string;
  weather_icon: string;
  wind_speed_10m: number;
  precipitation: number;
  time: string;
}

export interface DailyWeather {
  temperature_2m_max: number;
  temperature_2m_min: number;
  weather_code: number;
  weather_text: string;
  weather_icon: string;
  precipitation_probability_max: number;
}

export interface Weather {
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  fetched_at: string;
  current: CurrentWeather;
  daily: DailyWeather;
  stale: boolean;
  age_minutes: number;
  location_mismatch: boolean;
}

export interface DisplayResponse {
  title: string;
  now: { iso: string; date: string; time: string; weekday: string; timestamp: number };
  weather: Weather;
  events: DisplayEvent[];
  poll_hint_seconds: number;
}
