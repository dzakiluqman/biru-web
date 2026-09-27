import React from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TicketForm from '@/components/contact/TicketForm';
import { MapPin, Mail, Phone, Clock, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const defaultService = typeof resolvedSearchParams?.service === 'string' ? resolvedSearchParams.service : undefined;

  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="pt-32 pb-24 bg-white relative overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Content Layout: Form (Left) & Direct Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <TicketForm locale={locale} defaultService={defaultService} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Quick Fast Track card */}
            <div className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Jalur Cepat WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bicara langsung dengan Solution Architect
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                Butuh diskusi mendesak atau konsultasi arsitektur instan? Tim kami siaga untuk merespons pertanyaan Anda via WhatsApp resmi kami.
              </p>

              <a
                href="https://wa.me/6281192837722?text=Halo%20biru%2C%20saya%20ingin%20berkonsultasi%20mengenai%20proyek%20teknologi."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Buka Chat WhatsApp Resmi</span>
              </a>
            </div>

            {/* Office Info card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">{t('info.officeTitle')}</strong>
                    <span className="text-slate-600 leading-relaxed">{t('info.officeAddress')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">{t('info.emailTitle')}</strong>
                    <a href="mailto:halo@biru.agency" className="text-blue-600 hover:underline">
                      {t('info.emailVal')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">{t('info.phoneTitle')}</strong>
                    <a href="https://wa.me/6281192837722" className="text-slate-700 hover:text-slate-900">
                      {t('info.phoneVal')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">{t('info.hoursTitle')}</strong>
                    <span className="text-slate-600">{t('info.hoursVal')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Kerahasiaan data terjamin dengan NDA resmi bila diperlukan.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
