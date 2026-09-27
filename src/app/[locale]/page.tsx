import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import ValueProps from '@/components/home/ValueProps';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import PortfolioShowcase from '@/components/home/PortfolioShowcase';
import WorkflowSteps from '@/components/home/WorkflowSteps';
import Testimonials from '@/components/home/Testimonials';
import CtaBanner from '@/components/home/CtaBanner';
import {
  fetchDynamicServices,
  fetchDynamicPortfolio,
  fetchDynamicTestimonials,
} from '@/utils/supabase/data';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch dynamic content from Supabase
  const [services, portfolio, testimonials] = await Promise.all([
    fetchDynamicServices(),
    fetchDynamicPortfolio(),
    fetchDynamicTestimonials(),
  ]);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white">
      <Hero locale={locale} />
      <ValueProps />
      <ServicesShowcase locale={locale} services={services} />
      <PortfolioShowcase locale={locale} portfolio={portfolio} />
      <WorkflowSteps />
      <Testimonials locale={locale} testimonials={testimonials} />
      <CtaBanner locale={locale} />
    </div>
  );
}
