"use client";

import { useMemo, useState } from "react";
import TaskCard from "../../components/tasks/TaskCard";
import StatCard from "../../components/ui/StatCard";
import { Plus, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

type Task = {
  id: string;
  title: string;
  due?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
};

const SAMPLE_TASKS: Task[] = [
  { id: "t1", title: "Irrigate North Field", due: "2026-06-16", assignee: "Samuel", priority: "high" },
  { id: "t2", title: "Apply fertilizer", due: "2026-06-18", assignee: "Aisha", priority: "medium", completed: true },
  { id: "t3", title: "Vet visit for poultry", due: "2026-06-20", assignee: "Dr. K", priority: "high" },
  { id: "t4", title: "Harvest demo bed", due: "2026-06-25", assignee: "Team", priority: "low" },
];

export default function TasksPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SAMPLE_TASKS;
    return SAMPLE_TASKS.filter((s) => s.title.toLowerCase().includes(t) || (s.assignee || "").toLowerCase().includes(t));
  }, [q]);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">Assign work and track progress.</p>
          </div>

          <div className="hidden gap-3 sm:flex">
            <StatCard title="Open" value={SAMPLE_TASKS.filter(t=>!t.completed).length} icon={CheckSquare} />
            <StatCard title="Completed" value={SAMPLE_TASKS.filter(t=>t.completed).length} icon={CheckSquare} />
          </div>
        </header>

        <div className="mb-4 flex w-full gap-3">
          <label className="flex w-full items-center gap-3 rounded-md border bg-card p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks or assignees…"
              className="w-full bg-transparent px-1 py-2 text-sm outline-none"
            />
          </label>
          <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:hidden">
            <Plus size={14} />
          </button>
        </div>

        <motion.section layout className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </motion.section>
      </div>
    </div>
  );
}
