'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5 Navigation Items required
  const navItems = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.services'), href: `/${locale}/services` },
    { label: t('nav.portfolio'), href: `/${locale}/portfolio` },
    { label: t('nav.about'), href: `/${locale}/about` },
    { label: t('nav.contact'), href: `/${locale}/contact` },
  ];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    const segments = pathname.split('/');
    if (segments.length > 1 && (segments[1] === 'id' || segments[1] === 'en')) {
      segments[1] = newLocale;
      router.push(segments.join('/') || `/${newLocale}`);
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3.5 shadow-sm bg-white/90 backdrop-blur-md'
          : 'bg-white/80 py-5 border-b border-slate-100 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Placeholder using Next.js Image component */}
          {/* NOTE: To swap the actual logo file, replace /logo.png in public/ directory or update the src attribute below */}
          <Link
            href={`/${locale}`}
            prefetch={true}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative flex items-center">
              <Image
                src="/logo.png"
                alt="biru Logo"
                width={120}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
              {/* Fallback visual brand typography alongside logo image */}
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 ml-1.5 flex items-center">
                biru<span className="w-2 h-2 rounded-full bg-blue-600 ml-0.5 inline-block" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (5 Items) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: ONLY the Language Switcher toggle (NO CTA buttons) */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => switchLanguage('id')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  locale === 'id'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => switchLanguage(locale === 'id' ? 'en' : 'id')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{locale.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fluid Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 px-6 pt-4 pb-6 mt-3 shadow-lg bg-white animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/admin/login"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs font-semibold block"
              >
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
