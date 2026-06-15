"use client";

import WeatherWidget from "../../components/weather/WeatherWidget";
import StatCard from "../../components/ui/StatCard";
import { CloudRain } from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Weather</h1>
            <p className="mt-1 text-sm text-muted-foreground">Local weather to plan farm activities.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="Location" value={process.env.NEXT_PUBLIC_WEATHER_LOCATION || "Buea"} icon={CloudRain} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}
