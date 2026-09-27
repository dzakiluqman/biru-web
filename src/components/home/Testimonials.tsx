'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Testimonial } from '@/types/database';
import { Star, Quote, Sparkles } from 'lucide-react';

interface TestimonialsProps {
  locale: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ locale, testimonials }: TestimonialsProps) {
  const t = useTranslations('home.testimonials');

  // Filter to featured testimonials
  const featured = testimonials.filter((t) => t.is_featured);

  return (
    <section className="py-24 relative bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Dynamic Testimonials Grid from Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item) => {
            const quote = locale === 'en' ? item.content_en : item.content_id;

            return (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 flex flex-col justify-between transition-all hover:-translate-y-1"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400 mb-6">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-blue-200 mb-3" />
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-8">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {item.avatar_url ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={item.avatar_url}
                        alt={item.client_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                      {item.client_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.client_name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.client_role_company}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
