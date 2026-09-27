'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap, ShieldCheck, Search, LayoutTemplate, Sparkles } from 'lucide-react';

export default function ValueProps() {
  const t = useTranslations('home.values');

  const values = [
    {
      icon: Zap,
      title: t('speed.title'),
      desc: t('speed.desc'),
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
    },
    {
      icon: ShieldCheck,
      title: t('security.title'),
      desc: t('security.desc'),
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200',
    },
    {
      icon: Search,
      title: t('seo.title'),
      desc: t('seo.desc'),
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
    },
    {
      icon: LayoutTemplate,
      title: t('ux.title'),
      desc: t('ux.desc'),
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50 border-cyan-200',
    },
  ];

  return (
    <section className="py-24 relative bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="group relative glass-panel p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300"
              >
                <div className={`w-12 h-12 rounded-xl border ${v.iconBg} flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${v.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
