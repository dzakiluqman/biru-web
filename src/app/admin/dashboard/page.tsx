import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/actions/auth';
import {
  fetchTickets,
  fetchDynamicServices,
  fetchDynamicPortfolio,
  fetchDynamicTestimonials,
} from '@/utils/supabase/data';
import AdminConsoleClient from '@/components/admin/AdminConsoleClient';

export const metadata = {
  title: 'Dashboard Manajemen | biru Admin Console',
  description: 'Kelola tiket proyek, layanan, portofolio, dan testimoni secara terpusat',
};

export default async function AdminDashboardPage() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  // Fetch all 4 collections from Supabase
  const [{ tickets }, services, portfolio, testimonials] = await Promise.all([
    fetchTickets(),
    fetchDynamicServices(),
    fetchDynamicPortfolio(),
    fetchDynamicTestimonials(),
  ]);

  return (
    <AdminConsoleClient
      initialTickets={tickets}
      initialServices={services}
      initialPortfolio={portfolio}
      initialTestimonials={testimonials}
    />
  );
}
