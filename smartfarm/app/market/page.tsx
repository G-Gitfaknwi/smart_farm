"use client";

import MarketChart from "../../components/market/MarketChart";
import StatCard from "../../components/ui/StatCard";
import { TrendingUp } from "lucide-react";

const SAMPLE = [
  { date: "2026-01", price: 120 },
  { date: "2026-02", price: 130 },
  { date: "2026-03", price: 125 },
  { date: "2026-04", price: 140 },
  { date: "2026-05", price: 150 },
  { date: "2026-06", price: 145 },
];

export default function MarketPage() {
  const latest = SAMPLE[SAMPLE.length - 1].price;

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Market Prices</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track crop prices and trends.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="Latest Price" value={`₦${latest}`} icon={TrendingUp} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <MarketChart data={SAMPLE} />
        </div>
      </div>
    </div>
  );
}
