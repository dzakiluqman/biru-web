'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquareCode, Palette, Code2, Rocket, ArrowRight, Sparkles } from 'lucide-react';

export default function WorkflowSteps() {
  const t = useTranslations('home.workflow');

  const steps = [
    {
      num: '01',
      icon: MessageSquareCode,
      title: t('step1.title'),
      desc: t('step1.desc'),
    },
    {
      num: '02',
      icon: Palette,
      title: t('step2.title'),
      desc: t('step2.desc'),
    },
    {
      num: '03',
      icon: Code2,
      title: t('step3.title'),
      desc: t('step3.desc'),
    },
    {
      num: '04',
      icon: Rocket,
      title: t('step4.title'),
      desc: t('step4.desc'),
    },
  ];

  return (
    <section className="py-24 relative bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
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

        {/* 4-Step Grid with progressive connector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all duration-300 group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-slate-300 group-hover:text-blue-600 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
