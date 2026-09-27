import React from 'react';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Compass,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const coreValues = [
    {
      icon: Terminal,
      title: t('values.v1.title'),
      desc: t('values.v1.desc'),
    },
    {
      icon: Sparkles,
      title: t('values.v2.title'),
      desc: t('values.v2.desc'),
    },
    {
      icon: Zap,
      title: t('values.v3.title'),
      desc: t('values.v3.desc'),
    },
    {
      icon: ShieldCheck,
      title: t('values.v4.title'),
      desc: t('values.v4.desc'),
    },
  ];

  const techCategories = [
    {
      category: 'Frontend & UI Engineering',
      description: 'Menyajikan antarmuka pengguna tanpa lag (sub-second rendering) dengan standar estetika tertinggi.',
      technologies: [
        { name: 'Next.js 16', role: 'App Router & React Server Components', badge: 'Core' },
        { name: 'React 19', role: 'Next-gen concurrent UI runtime', badge: 'Core' },
        { name: 'TypeScript', role: '100% End-to-end Strict Type Safety', badge: 'Standard' },
        { name: 'Tailwind CSS', role: 'Utility-first responsive tokens', badge: 'Design' },
        { name: 'Framer Motion', role: 'Fluid physics-based micro-interactions', badge: 'Animation' },
        { name: 'Lucide Icons', role: 'Consistent pixel-perfect iconography', badge: 'UI' },
      ],
    },
    {
      category: 'Database, Auth & Cloud Backend',
      description: 'Arsitektur data tangguh berorientasi audit, enkripsi data in-transit & at-rest, serta kueri teroptimasi.',
      technologies: [
        { name: 'Supabase (PostgreSQL)', role: 'Distributed SQL Cloud Database', badge: 'Database' },
        { name: 'Row Level Security (RLS)', role: 'Granular database-level access control', badge: 'Security' },
        { name: 'Supabase Auth', role: 'Multi-factor authentication & JWTs', badge: 'Auth' },
        { name: 'Redis Cache', role: 'Sub-millisecond query & session caching', badge: 'In-Memory' },
        { name: 'Resend API', role: 'Reliable transactional email routing', badge: 'Dispatch' },
        { name: 'Zod & Hook Form', role: 'Type-safe schema validation', badge: 'Validation' },
      ],
    },
    {
      category: 'DevOps, CI/CD & Reliability',
      description: 'Infrastruktur cloud berstandar enterprise yang menjamin ketersediaan sistem 99.98% tanpa downtime.',
      technologies: [
        { name: 'Vercel Edge Network', role: 'Global edge rendering & CDN caching', badge: 'Edge' },
        { name: 'Docker Containers', role: 'Reproducible isolated microservices', badge: 'Container' },
        { name: 'GitHub Actions', role: 'Automated linting, building & testing', badge: 'CI/CD' },
        { name: 'Sentry Telemetry', role: 'Real-time error & bottleneck tracking', badge: 'Monitoring' },
      ],
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

        {/* Company Story & Philosophy */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 mb-20 shadow-xs">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                b.
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('story.title')}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {t('story.p1')}
            </p>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {t('story.p2')}
            </p>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-blue-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t('mission.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {t('mission.desc')}
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-indigo-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t('vision.title')}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {t('vision.desc')}
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
              <span>{t('values.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {t('values.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Tech Stack Showcase */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
              <span>{t('stack.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {t('stack.title')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t('stack.subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {techCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {cat.category}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {cat.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.technologies.map((tech, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs hover:border-blue-300 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {tech.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {tech.role}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {tech.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
