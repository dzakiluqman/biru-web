import React from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';

  return {
    title: isId
      ? 'biru | Agensi Rekayasa Perangkat Lunak, Sistem Kustom (ERP/CRM/POS) & Automasi Bisnis'
      : 'biru | Enterprise Software Engineering, Custom ERP/CRM/POS & Business Automation',
    description: isId
      ? 'Agensi transformasi digital terdepan untuk pengembangan website modern, custom digital system (ERP/CRM/POS), dan automasi alur kerja enterprise berkinerja tinggi.'
      : 'Elite digital transformation agency engineering ultra-fast web platforms, custom ERP/CRM/POS digital systems, and enterprise workflow automation.',
    keywords: [
      'digital agency indonesia',
      'jasa pembuatan website enterprise',
      'custom ERP',
      'custom CRM',
      'POS system',
      'business automation',
      'Next.js development',
      'Supabase development',
    ],
    openGraph: {
      title: 'biru - Digital Engineering & Business Automation',
      description: 'High-performance web applications, custom digital systems (ERP/CRM/POS), and business automation.',
      siteName: 'biru Digital Agency',
      locale: isId ? 'id_ID' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'id-ID': '/id',
        'en-US': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'id' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar locale={locale} />
      <div className="flex-1 w-full flex flex-col">{children}</div>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
