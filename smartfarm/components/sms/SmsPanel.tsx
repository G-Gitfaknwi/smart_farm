"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SmsPanel() {
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function send() {
    setSending(true);
    try {
      // Prototype: call backend API `/api/sms` if implemented
      const res = await fetch('/api/sms', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ to, message: msg }) });
      if (!res.ok) throw new Error('Failed');
      setLog((l) => [`Sent to ${to}`,...l]);
    } catch (e) {
      setLog((l) => [`Failed to send to ${to}`,...l]);
    } finally { setSending(false); setMsg(''); setTo(''); }
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full flex-col gap-3 rounded-lg bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">SMS</h3>
        <div className="text-xs text-muted-foreground">Prototype: requires `/api/sms`</div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
        <input value={to} onChange={(e)=>setTo(e.target.value)} placeholder="+2376xxxxxxx" className="col-span-1 rounded-md border bg-background p-2 text-sm" />
        <input value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Message" className="col-span-2 rounded-md border bg-background p-2 text-sm" />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={send} disabled={sending || !to || !msg} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{sending? 'Sending...' : 'Send SMS'}</button>
        <button onClick={()=>{ setTo(''); setMsg(''); }} className="rounded-md border px-3 py-2 text-sm">Clear</button>
      </div>

      <div className="mt-2 max-h-40 overflow-auto text-xs text-muted-foreground">
        {log.length === 0 ? <div>No messages yet.</div> : log.map((l, i) => <div key={i} className="py-1 border-b last:border-b-0">{l}</div>)}
      </div>
    </motion.section>
  );
}
