'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginAdminAction } from '@/actions/auth';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await loginAdminAction({ email, password });
      if (res.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Autentikasi gagal. Silakan coba kembali.');
      }
    });
  };

  const handleFillDemo = () => {
    setEmail('admin@biru.agency');
    setPassword('biru2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-blue-100/60 rounded-full blur-[60px] pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/logo.png"
              alt="biru Logo"
              width={110}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konsol Manajemen Tiket & Konten Dinamis biru
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@biru.agency"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer mt-6"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center relative z-10">
          <p className="text-[11px] text-slate-500 mb-2">
            Mode Evaluasi / Demo:
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Isi Kredensial Demo Cepat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
