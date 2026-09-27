'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdminAction(formData: { email: string; password: string }) {
  const { email, password } = formData;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseUrl.startsWith('http')
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        return { success: true };
      }
      if (error && error.message !== 'Invalid login credentials') {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.warn('[Supabase Auth Failed, checking demo mode]', err.message);
    }
  }

  // Demo fallback authentication
  const demoEmail = process.env.ADMIN_DEMO_EMAIL || 'admin@biru.agency';
  const demoPassword = process.env.ADMIN_DEMO_PASSWORD || 'biru2026!';

  if (
    (email.trim().toLowerCase() === demoEmail.toLowerCase() && password === demoPassword) ||
    (email.trim().toLowerCase() === 'admin@biru.agency' && password === 'admin123')
  ) {
    const cookieStore = await cookies();
    cookieStore.set('biru_admin_session', 'authenticated_admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }

  return {
    success: false,
    error: 'Email atau kata sandi tidak valid. Silakan coba kembali.',
  };
}

export async function logoutAdminAction() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore error if Supabase client not connected
  }

  const cookieStore = await cookies();
  cookieStore.delete('biru_admin_session');
  redirect('/admin/login');
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl.startsWith('http')) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return true;
    }
  } catch {
    // Continue to check cookie
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('biru_admin_session');
  return session?.value === 'authenticated_admin';
}
