"use client";

import SmsPanel from "../../components/sms/SmsPanel";
import StatCard from "../../components/ui/StatCard";
import { MessageSquare } from "lucide-react";

export default function CommunicationPage() {
  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Communication</h1>
            <p className="mt-1 text-sm text-muted-foreground">Send SMS and view recent notifications.</p>
          </div>
          <div className="hidden gap-3 sm:flex">
            <StatCard title="SMS" value={"Prototype"} icon={MessageSquare} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <SmsPanel />
        </div>
      </div>
    </div>
  );
}
