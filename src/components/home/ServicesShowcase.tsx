'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ServiceItem } from '@/types/database';
import {
  Globe,
  Database,
  Layers,
  ShoppingBag,
  Cpu,
  Wrench,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

interface ServicesShowcaseProps {
  locale: string;
  services: ServiceItem[];
}

// Icon helper map
const iconMap: Record<string, LucideIcon> = {
  Globe,
  Database,
  Layers,
  ShoppingBag,
  Cpu,
  Wrench,
};

export default function ServicesShowcase({ locale, services }: ServicesShowcaseProps) {
  const t = useTranslations('home.services');

  // Filter to active services only
  const activeServices = services.filter((s) => s.is_active);

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-base mt-2">
              {t('subtitle')}
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            prefetch={true}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group self-start md:self-auto"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Services Grid from Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((item, index) => {
            const Icon = iconMap[item.icon_name] || Globe;
            const title = locale === 'en' ? item.title_en : item.title_id;
            const desc = locale === 'en' ? item.short_desc_en : item.short_desc_id;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl p-7 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <Link
                    href={`/${locale}/contact?service=${encodeURIComponent(item.title_en)}`}
                    prefetch={true}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Ajukan Tiket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-xs text-slate-400 font-medium">Enterprise Tier</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
