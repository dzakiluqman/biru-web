'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('home.hero');

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-white">
      {/* Background Subtle Grid Lines with Soft Radial Mask Overlay */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* Subtle soft gradient glows in light mode */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-100/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
            {locale === 'id' ? (
              <>
                Membangun Ekosistem Digital{' '}
                <span className="text-gradient-blue inline-block">
                  Berkecepatan Tinggi
                </span>{' '}
                untuk Bisnis Skala Global
              </>
            ) : (
              <>
                Architecting{' '}
                <span className="text-gradient-blue inline-block">
                  Ultra-Fast
                </span>{' '}
                Digital Ecosystems for Global Scale
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={`/${locale}/contact`}
              prefetch={true}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{t('primaryCta')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href={`/${locale}/portfolio`}
              prefetch={true}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-base transition-all"
            >
              <span>{t('secondaryCta')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl text-center bg-white/90">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xl md:text-2xl font-black text-slate-900">99.98%</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t('stats.uptime')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center bg-white/90">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xl md:text-2xl font-black text-slate-900">&lt; 0.8s</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t('stats.speed')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center bg-white/90">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xl md:text-2xl font-black text-slate-900">120+</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t('stats.delivered')}</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-center bg-white/90">
              <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xl md:text-2xl font-black text-slate-900">4.9/5</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t('stats.satisfaction')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
