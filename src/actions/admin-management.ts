'use server';

import {
  serviceSchema,
  ServiceInput,
  ServiceItem,
  portfolioSchema,
  PortfolioInput,
  PortfolioItem,
  testimonialSchema,
  TestimonialInput,
  Testimonial,
} from '@/types/database';
import {
  upsertService,
  deleteService,
  upsertPortfolio,
  deletePortfolio,
  upsertTestimonial,
  deleteTestimonial,
} from '@/utils/supabase/data';
import { revalidatePath } from 'next/cache';

// SERVICES ACTIONS
export async function saveServiceAction(
  input: ServiceInput,
  id?: string
): Promise<{ success: boolean; service?: ServiceItem; error?: string }> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: (parsed.error as any).issues?.map((e: any) => e.message).join(', ') || 'Data tidak valid',
    };
  }

  const result = await upsertService(parsed.data, id);
  if (!result.success) return result;

  revalidatePath('/admin/dashboard');
  revalidatePath('/id/services');
  revalidatePath('/en/services');
  revalidatePath('/id');
  revalidatePath('/en');
  return result;
}

export async function deleteServiceAction(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await deleteService(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/id/services');
  revalidatePath('/en/services');
  return result;
}

// PORTFOLIO ACTIONS
export async function savePortfolioAction(
  input: PortfolioInput,
  id?: string
): Promise<{ success: boolean; portfolio?: PortfolioItem; error?: string }> {
  const parsed = portfolioSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: (parsed.error as any).issues?.map((e: any) => e.message).join(', ') || 'Data tidak valid',
    };
  }

  const result = await upsertPortfolio(parsed.data, id);
  if (!result.success) return result;

  revalidatePath('/admin/dashboard');
  revalidatePath('/id/portfolio');
  revalidatePath('/en/portfolio');
  revalidatePath('/id');
  revalidatePath('/en');
  return result;
}

export async function deletePortfolioAction(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await deletePortfolio(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/id/portfolio');
  revalidatePath('/en/portfolio');
  revalidatePath('/id');
  revalidatePath('/en');
  return result;
}

// TESTIMONIALS ACTIONS
export async function saveTestimonialAction(
  input: TestimonialInput,
  id?: string
): Promise<{ success: boolean; testimonial?: Testimonial; error?: string }> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: (parsed.error as any).issues?.map((e: any) => e.message).join(', ') || 'Data tidak valid',
    };
  }

  const result = await upsertTestimonial(parsed.data, id);
  if (!result.success) return result;

  revalidatePath('/admin/dashboard');
  revalidatePath('/id');
  revalidatePath('/en');
  return result;
}

export async function deleteTestimonialAction(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await deleteTestimonial(id);
  revalidatePath('/admin/dashboard');
  revalidatePath('/id');
  revalidatePath('/en');
  return result;
}
