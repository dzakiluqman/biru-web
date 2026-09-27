import { z } from 'zod';

// ==============================================================================
// 1. TICKETS
// ==============================================================================
export type TicketStatus = 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'DEAL' | 'CLOSED';

export interface Ticket {
  id: string;
  ticket_code: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  budget_range: string;
  description: string;
  status: TicketStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export const ticketSubmissionSchema = z.object({
  client_name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }),
  client_email: z.string().email({ message: 'Format email tidak valid' }),
  client_phone: z.string().min(8, { message: 'Nomor WhatsApp minimal 8 digit' }),
  service_type: z.string().min(1, { message: 'Pilih jenis layanan' }),
  budget_range: z.string().min(1, { message: 'Pilih rentang estimasi anggaran' }),
  description: z.string().min(10, { message: 'Deskripsi proyek minimal 10 karakter' }),
});

export type TicketSubmissionInput = z.infer<typeof ticketSubmissionSchema>;

// ==============================================================================
// 2. TESTIMONIALS
// ==============================================================================
export interface Testimonial {
  id: string;
  client_name: string;
  client_role_company: string;
  content_id: string;
  content_en: string;
  avatar_url?: string | null;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

export const testimonialSchema = z.object({
  client_name: z.string().min(2, { message: 'Nama klien wajib diisi' }),
  client_role_company: z.string().min(2, { message: 'Jabatan & perusahaan wajib diisi' }),
  content_id: z.string().min(10, { message: 'Konten testimoni (ID) minimal 10 karakter' }),
  content_en: z.string().min(10, { message: 'Konten testimoni (EN) minimal 10 karakter' }),
  avatar_url: z.string().url().optional().or(z.literal('')),
  rating: z.coerce.number().min(1).max(5),
  is_featured: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ==============================================================================
// 3. PORTFOLIO
// ==============================================================================
export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description_id: string;
  description_en: string;
  category: string;
  image_url: string;
  live_url?: string | null;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export const portfolioSchema = z.object({
  title: z.string().min(3, { message: 'Judul proyek minimal 3 karakter' }),
  slug: z.string().min(3, { message: 'Slug URL minimal 3 karakter' }),
  description_id: z.string().min(10, { message: 'Deskripsi (ID) minimal 10 karakter' }),
  description_en: z.string().min(10, { message: 'Deskripsi (EN) minimal 10 karakter' }),
  category: z.string().min(2, { message: 'Kategori wajib diisi' }),
  image_url: z.string().url({ message: 'URL gambar tidak valid' }),
  live_url: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, { message: 'Minimal cantumkan 1 teknologi' }),
  is_featured: z.boolean().default(true),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;

// ==============================================================================
// 4. SERVICES
// ==============================================================================
export interface ServiceItem {
  id: string;
  title_id: string;
  title_en: string;
  short_desc_id: string;
  short_desc_en: string;
  full_desc_id: string;
  full_desc_en: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
}

export const serviceSchema = z.object({
  title_id: z.string().min(3, { message: 'Judul (ID) minimal 3 karakter' }),
  title_en: z.string().min(3, { message: 'Judul (EN) minimal 3 karakter' }),
  short_desc_id: z.string().min(10, { message: 'Deskripsi singkat (ID) minimal 10 karakter' }),
  short_desc_en: z.string().min(10, { message: 'Deskripsi singkat (EN) minimal 10 karakter' }),
  full_desc_id: z.string().min(20, { message: 'Deskripsi lengkap (ID) minimal 20 karakter' }),
  full_desc_en: z.string().min(20, { message: 'Deskripsi lengkap (EN) minimal 20 karakter' }),
  icon_name: z.string().min(1, { message: 'Pilih nama icon' }),
  is_active: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
