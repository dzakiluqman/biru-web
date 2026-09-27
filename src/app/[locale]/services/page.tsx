import React from 'react';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { fetchDynamicServices } from '@/utils/supabase/data';
import {
  Globe,
  Database,
  Layers,
  ShoppingBag,
  Cpu,
  Wrench,
  Check,
  Minus,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Database,
  Layers,
  ShoppingBag,
  Cpu,
  Wrench,
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  // Dynamic services fetched from Supabase
  const services = await fetchDynamicServices();
  const activeServices = services.filter((s) => s.is_active);

  const comparisonRows = [
    {
      feature: 'Arsitektur Kustom & Desain UI/UX',
      starter: 'Desain Kustom Eksklusif',
      growth: 'Design System Lengkap + Prototyping',
      enterprise: 'Bespoke Enterprise UI/UX + Audit UX',
    },
    {
      feature: 'Framework Frontend',
      starter: 'Next.js 16 + TypeScript',
      growth: 'Next.js 16 + TypeScript + PWA',
      enterprise: 'Next.js + Micro-frontends + Mobile SDK',
    },
    {
      feature: 'Database & Keamanan',
      starter: 'PostgreSQL Cloud',
      growth: 'Supabase Cloud + RLS Security',
      enterprise: 'Dedicated High-Availability Cluster',
    },
    {
      feature: 'Dukungan Multi-Bahasa (i18n)',
      starter: '2 Bahasa (ID & EN)',
      growth: 'Hingga 4 Bahasa',
      enterprise: 'Bahasa Tak Terbatas + Lokalisasi Wilayah',
    },
    {
      feature: 'Modul ERP / CRM / POS',
      starter: 'Bukan Fokus Utama',
      growth: 'Termasuk 2 Modul Terintegrasi',
      enterprise: 'Full Suite Kustom Tanpa Batas Modul',
    },
    {
      feature: 'Automasi WhatsApp / Email',
      starter: 'Notifikasi Dasar (Resend)',
      growth: 'Alur Kerja Otomatis Penuh',
      enterprise: 'Custom Webhook, WhatsApp Bot & AI Agents',
    },
    {
      feature: 'Dukungan SLA & Standby',
      starter: 'Jam Kerja (8/5)',
      growth: 'Prioritas (12/7)',
      enterprise: 'Dedikasi 24/7 (SLA 99.98% Guarantee)',
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-white relative overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Dynamic Services Breakdown */}
        <div className="space-y-10 mb-28">
          {activeServices.map((service, idx) => {
            const Icon = iconMap[service.icon_name] || Globe;
            const title = locale === 'en' ? service.title_en : service.title_id;
            const fullDesc = locale === 'en' ? service.full_desc_en : service.full_desc_id;
            const shortDesc = locale === 'en' ? service.short_desc_en : service.short_desc_id;

            return (
              <div
                key={service.id}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 sm:p-10 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                          Layanan 0{idx + 1}
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900">
                          {title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-slate-600 text-base leading-relaxed">
                      {fullDesc}
                    </p>
                    <p className="text-slate-500 text-sm italic">
                      {shortDesc}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col gap-3 w-full lg:w-auto">
                    <Link
                      href={`/${locale}/contact?service=${encodeURIComponent(service.title_en)}`}
                      prefetch={true}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all text-center"
                    >
                      <span>{t('requestTicket')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
              <span>{t('matrix.badge')}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {t('matrix.title')}
            </h2>
            <p className="text-slate-600 text-sm">
              {t('matrix.subtitle')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-sm font-bold text-slate-900 w-1/4">
                    {t('matrix.headers.features')}
                  </th>
                  <th className="p-5 text-sm font-bold text-slate-700 w-1/4">
                    <div className="text-slate-900 font-extrabold">{t('matrix.headers.starter')}</div>
                    <div className="text-xs text-slate-500 font-normal mt-1">{t('matrix.plans.starterDesc')}</div>
                  </th>
                  <th className="p-5 text-sm font-bold text-blue-700 w-1/4 bg-blue-50/50 border-x border-blue-200">
                    <div className="text-blue-700 font-extrabold flex items-center gap-1.5">
                      <span>{t('matrix.headers.growth')}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">Populer</span>
                    </div>
                    <div className="text-xs text-blue-600/80 font-normal mt-1">{t('matrix.plans.growthDesc')}</div>
                  </th>
                  <th className="p-5 text-sm font-bold text-slate-700 w-1/4">
                    <div className="text-slate-900 font-extrabold">{t('matrix.headers.enterprise')}</div>
                    <div className="text-xs text-slate-500 font-normal mt-1">{t('matrix.plans.enterpriseDesc')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 font-semibold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="p-5 text-slate-600">
                      {row.starter}
                    </td>
                    <td className="p-5 font-semibold text-blue-700 bg-blue-50/30 border-x border-blue-100">
                      {row.growth}
                    </td>
                    <td className="p-5 text-slate-800 font-medium">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
