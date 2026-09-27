import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logoutAdminAction } from '@/actions/auth';
import { LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Admin Command Console | biru Digital Agency',
  description: 'Enterprise ticket, services, portfolio, and testimonials management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Admin Header Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/id"
              prefetch={true}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Website Publik</span>
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="biru Logo"
                width={100}
                height={32}
                className="h-7 w-auto object-contain"
              />
              <span className="font-extrabold text-lg text-slate-900 ml-1">biru</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-mono font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RLS Protected (Supabase)</span>
            </div>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
