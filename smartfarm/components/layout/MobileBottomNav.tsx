'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Home, Sprout, Package, Wallet, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/farm', label: 'Farm', icon: Sprout },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/finance', label: 'Finance', icon: Wallet },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export default function MobileBottomNav() {
  const path = usePathname() || '/';
  const { signOut, user } = useAuth();

  return (
    <nav aria-label="Bottom navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-slate-200/50 dark:border-zinc-900/50 md:hidden px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {tabs.map((t) => {
          const active = path === t.href;
          const Icon = t.icon;
          return (
            <Link 
              key={t.href} 
              href={t.href} 
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all ${
                active 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 tracking-tight">{t.label}</span>
            </Link>
          );
        })}
        {user && (
          <button 
            onClick={() => signOut()}
            className="flex flex-col items-center justify-center flex-1 py-1.5 text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
