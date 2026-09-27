import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { fetchDynamicPortfolio } from '@/utils/supabase/data';
import PortfolioPageClient from '@/components/portfolio/PortfolioPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'id' ? 'Portofolio Karya & Proyek | biru' : 'Flagship Portfolio & Case Studies | biru',
    description: 'Eksplorasi portofolio rekayasa website, ERP, CRM, dan automasi bisnis kustom biru.',
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const portfolio = await fetchDynamicPortfolio();

  return <PortfolioPageClient locale={locale} initialPortfolio={portfolio} />;
}
