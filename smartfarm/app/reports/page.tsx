"use client";

import { useMemo } from "react";
import { RevenueTrend, InventoryDistribution } from "../../components/reports/ReportsChart";
import StatCard from "../../components/ui/StatCard";
import { BarChart2 } from "lucide-react";

const TREND = [
  { month: "Jan", revenue: 120000, expenses: 70000 },
  { month: "Feb", revenue: 90000, expenses: 50000 },
  { month: "Mar", revenue: 140000, expenses: 60000 },
  { month: "Apr", revenue: 160000, expenses: 80000 },
  { month: "May", revenue: 130000, expenses: 75000 },
  { month: "Jun", revenue: 170000, expenses: 90000 },
];

const DIST = [
  { name: "Seeds", value: 120 },
  { name: "Feed", value: 90 },
  { name: "Fertilizer", value: 60 },
  { name: "Medicine", value: 30 },
  { name: "Other", value: 20 },
];

export default function ReportsPage() {
  const totalRevenue = useMemo(() => TREND.reduce((s, r) => s + r.revenue, 0), []);
  const totalExpenses = useMemo(() => TREND.reduce((s, r) => s + r.expenses, 0), []);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">Revenue, expenses and inventory insights.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="Revenue (YTD)" value={`₦${totalRevenue.toLocaleString()}`} icon={BarChart2} />
            <StatCard title="Expenses (YTD)" value={`₦${totalExpenses.toLocaleString()}`} icon={BarChart2} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RevenueTrend data={TREND} />
          <InventoryDistribution data={DIST} />
        </div>
      </div>
    </div>
  );
}
