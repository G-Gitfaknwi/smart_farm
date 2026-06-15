"use client";

import { useEffect, useState } from "react";
import { Sun, CloudRain, Thermometer, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type Weather = {
  temp: number;
  description: string;
  humidity?: number;
  city?: string;
};

const SAMPLE: Weather = { temp: 28, description: "Partly cloudy", humidity: 68, city: "Buea" };

export default function WeatherWidget({ location }: { location?: string }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const loc = location || process.env.NEXT_PUBLIC_WEATHER_LOCATION || "Buea";

  useEffect(() => {
    let mounted = true;

    async function fetchWeather() {
      try {
        const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (!key) {
          setWeather(SAMPLE);
          return;
        }

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${key}`);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        if (!mounted) return;
        setWeather({ temp: Math.round(json.main.temp), description: json.weather[0].description, humidity: json.main.humidity, city: json.name });
      } catch (e) {
        setWeather(SAMPLE);
      }
    }

    fetchWeather();
    return () => {
      mounted = false;
    };
  }, [loc]);

  if (!weather) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full flex-col gap-2 rounded-lg bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <div className="text-sm font-semibold text-card-foreground">{weather.city}</div>
        </div>
        <div className="text-xs text-muted-foreground">Updated: now</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary p-3 text-primary-foreground">
            <Sun size={22} />
          </div>
          <div>
            <div className="text-2xl font-semibold">{weather.temp}°C</div>
            <div className="text-sm text-muted-foreground capitalize">{weather.description}</div>
          </div>
        </div>

        <div className="flex flex-col items-end text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Thermometer size={14} /> <span>{weather.temp}°C</span></div>
          <div className="flex items-center gap-1"><CloudRain size={14} /> <span>{weather.humidity}%</span></div>
        </div>
      </div>
    </motion.div>
  );
}
