'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';

interface CtaBannerProps {
  locale: string;
}

export default function CtaBanner({ locale }: CtaBannerProps) {
  const t = useTranslations('home.cta');

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 shadow-lg text-center max-w-5xl mx-auto">
          {/* Subtle soft gradient */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/contact`}
                prefetch={true}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{t('button')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="https://wa.me/6281192837722?text=Halo%20biru%2C%20saya%20ingin%20konsultasi%20mengenai%20kebutuhan%20proyek%20digital."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300 font-bold text-sm shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t('directWhatsapp')}</span>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Respon arsitek teknis di bawah 2 jam kerja &bull; Bebas komitmen awal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
