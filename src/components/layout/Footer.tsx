import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Zap, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('common');

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={`/${locale}`} prefetch={true} className="inline-flex items-center gap-2 group cursor-pointer">
              <div className="relative flex items-center">
                <Image
                  src="/logo.png"
                  alt="biru Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 ml-1.5 flex items-center">
                  biru<span className="w-2 h-2 rounded-full bg-blue-600 ml-0.5 inline-block" />
                </span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('footer.securityBadge')}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('footer.performanceBadge')}</span>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold tracking-wider uppercase">
              {t('footer.servicesTitle')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  Web & Corporate Portals
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  Custom ERP & CRM
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  Omnichannel POS Systems
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  Business Automation
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  Managed Cloud Ops (24/7)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links (5 nav links reflected) */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold tracking-wider uppercase">
              {t('footer.companyTitle')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href={`/${locale}`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/portfolio`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} prefetch={true} className="hover:text-blue-600 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" prefetch={true} className="hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-semibold text-slate-700">
                  <span>{t('nav.admin')}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Office */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-xs font-bold tracking-wider uppercase">
              {t('footer.legalTitle')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>SCBD Lot 18, Jakarta Selatan, 12190</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="mailto:halo@biru.agency" className="hover:text-blue-600 transition-colors">
                  halo@biru.agency
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="https://wa.me/6281192837722" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  +62 811-9283-7722
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} biru Digital Agency. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">Enterprise Digital Engineering & Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
