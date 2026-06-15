"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function MarketChart({ data }: { data: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-56 w-full rounded-lg bg-card p-3 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-card-foreground">Market Price (₦)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 3 }} animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
