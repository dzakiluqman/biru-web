import { createClient as createServerClient } from './server';
import { createPublicClient } from './public';
import {
  Ticket,
  TicketSubmissionInput,
  TicketStatus,
  Testimonial,
  TestimonialInput,
  PortfolioItem,
  PortfolioInput,
  ServiceItem,
  ServiceInput,
} from '@/types/database';
import { sendTicketNotifications } from '@/utils/email';

// Default initial data stores (synced with schema.sql)
let inMemoryServices: ServiceItem[] = [
  {
    id: 's1-web',
    title_id: 'Website Enterprise & Portal',
    title_en: 'Enterprise Websites & Portals',
    short_desc_id: 'Website korporasi dan platform portal dinamis yang memancarkan kredibilitas tinggi serta konversi maksimal.',
    short_desc_en: 'High-converting corporate websites and dynamic portal platforms projecting undeniable authority and credibility.',
    full_desc_id: 'Pengembangan website modern berkinerja ultra tinggi dengan Next.js App Router, animasi fluid, optimasi Core Web Vitals 95-100, dan integrasi headless CMS fleksibel.',
    full_desc_en: 'Modern ultra-high performance web development powered by Next.js App Router, fluid animations, Core Web Vitals 95-100 scores, and flexible headless CMS integrations.',
    icon_name: 'Globe',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 200).toISOString(),
  },
  {
    id: 's2-erp',
    title_id: 'Sistem ERP / Supply Chain Kustom',
    title_en: 'Custom ERP & Supply Chain Systems',
    short_desc_id: 'Software tailored-fit untuk operasional rantai pasok, inventaris gudang, dan otomatisasi logistik.',
    short_desc_en: 'Tailor-fit software engineered for supply chain operations, warehouse inventory, and automated fleet logistics.',
    full_desc_id: 'Aplikasi web internal yang dirancang khusus untuk memetakan alur kerja spesifik bisnis Anda: dispatching pintar armada, multi-warehouse tracking, dan pelaporan keuangan real-time.',
    full_desc_en: 'Internal web applications engineered around your exact business workflows: intelligent fleet dispatching, multi-warehouse tracking, and real-time financial reporting.',
    icon_name: 'Database',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 180).toISOString(),
  },
  {
    id: 's3-crm',
    title_id: 'Sistem CRM & Penjualan B2B',
    title_en: 'Custom CRM & B2B Sales Engines',
    short_desc_id: 'Manajemen relasi pelanggan, pipeline prospek, dan otomatisasi penawaran harga.',
    short_desc_en: 'Customer relationship management, lead pipelines, and automated quotation workflows.',
    full_desc_id: 'Platform terpadu untuk tim sales dan customer support dengan lead scoring cerdas, integrasi WhatsApp Business API, dan rekonsiliasi pembayaran otomatis.',
    full_desc_en: 'Unified platform for sales and customer success teams featuring smart lead scoring, WhatsApp Business API integration, and automated payment reconciliation.',
    icon_name: 'Layers',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 160).toISOString(),
  },
  {
    id: 's4-pos',
    title_id: 'Aplikasi Kasir POS Multi-Outlet',
    title_en: 'Omnichannel POS Systems',
    short_desc_id: 'Aplikasi kasir Point-of-Sale cloud offline-first dengan sinkronisasi inventaris multi-cabang.',
    short_desc_en: 'Offline-first cloud Point-of-Sale application with real-time multi-branch inventory synchronization.',
    full_desc_id: 'Aplikasi kasir modern dengan kecepatan transaksi sub-detik, receipt printer, integrasi QRIS/payment gateway, dan manajemen loyalitas pelanggan.',
    full_desc_en: 'Modern cashier application featuring sub-second checkout speed, thermal receipt printing, QRIS integration, and customer loyalty management.',
    icon_name: 'ShoppingBag',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 140).toISOString(),
  },
  {
    id: 's5-auto',
    title_id: 'Automasi Bisnis & Integrasi API',
    title_en: 'Business Automation & API Sync',
    short_desc_id: 'Menghubungkan aplikasi akuntansi, WhatsApp bot, dan alur kerja harian untuk eliminasi friksi manual.',
    short_desc_en: 'Bridging accounting tools, WhatsApp bots, and daily workflows to eliminate repetitive manual friction.',
    full_desc_id: 'Solusi otomatisasi alur kerja tanpa jeda dengan webhook terdistribusi, ekstraksi dokumen OCR, dan integrasi Google Workspace / ERP.',
    full_desc_en: 'Zero-latency workflow automation with distributed webhooks, OCR document parsing, and Google Workspace / ERP integrations.',
    icon_name: 'Cpu',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    id: 's6-ops',
    title_id: 'Managed Cloud Ops & Maintenance (24/7)',
    title_en: 'Managed Cloud Ops & 24/7 Care',
    short_desc_id: 'Pemantauan 24/7, backup otomatis harian, audit keamanan berkala, dan SLA ketersediaan 99.98%.',
    short_desc_en: '24/7 telemetry monitoring, daily automated cloud backups, security patching, and 99.98% uptime SLA.',
    full_desc_id: 'Jaga infrastruktur web dan database Anda selalu cepat, aman, dan tahan beban tinggi dengan tim teknis siaga 24/7.',
    full_desc_en: 'Keep your web apps and PostgreSQL databases ultra-fast, secure, and resilient under heavy traffic with our 24/7 standby DevOps engineers.',
    icon_name: 'Wrench',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 100).toISOString(),
  },
];

let inMemoryPortfolio: PortfolioItem[] = [
  {
    id: 'p1-erp',
    title: 'Nusantara Logistics ERP',
    slug: 'nusantara-logistics-erp',
    description_id: 'Sistem ERP logistik real-time untuk armada 450+ truk di 12 provinsi, mencakup dispatching pintar, manajemen bahan bakar, dan invoice otomatis.',
    description_en: 'Real-time logistics ERP system orchestrating 450+ heavy trucks across 12 provinces with intelligent dispatching and automated invoicing.',
    category: 'Custom System',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://nusantaralogistics.co.id',
    tags: ['Next.js 16', 'TypeScript', 'Supabase RLS', 'PostgreSQL', 'Tailwind', 'Redis'],
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 150).toISOString(),
  },
  {
    id: 'p2-fintech',
    title: 'FinArtha Payment & Portal',
    slug: 'finartha-payment-portal',
    description_id: 'Platform pembayaran B2B dan rekonsiliasi perbankan otomatis dengan enkripsi keamanan bank-grade dan antarmuka analitik real-time.',
    description_en: 'B2B financial settlement platform and automated reconciliation engine featuring bank-grade encryption and real-time analytics.',
    category: 'Web Profile',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://finarthapay.com',
    tags: ['React 19', 'Next.js App Router', 'Bank API', 'Supabase Auth', 'Zod', 'Resend'],
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 130).toISOString(),
  },
  {
    id: 'p3-pos',
    title: 'KopiKultur Omnichannel POS',
    slug: 'kopikultur-omnichannel-pos',
    description_id: 'Aplikasi Point-of-Sale cloud offline-first untuk 28 gerai kopi dengan sinkronisasi inventaris instan dan program loyalitas pelanggan.',
    description_en: 'Offline-first cloud POS deployed across 28 flagship coffee outlets with live inventory synchronization and integrated loyalty points.',
    category: 'Custom System',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://kopikultur.id',
    tags: ['Next.js PWA', 'IndexedDB', 'PostgreSQL', 'WebSocket', 'Tailwind'],
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 110).toISOString(),
  },
  {
    id: 'p4-saas',
    title: 'AeroPulse Workflow Automation',
    slug: 'aeropulse-workflow-automation',
    description_id: 'Platform otomatisasi persetujuan dokumen tender, bot notifikasi WhatsApp terverifikasi, dan integrasi Google Workspace.',
    description_en: 'Automated procurement approval engine, verified WhatsApp alert bots, and bidirectional Google Workspace synchronization.',
    category: 'E-Commerce',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    live_url: 'https://aeropulse.io',
    tags: ['TypeScript', 'Next.js 16', 'WhatsApp API', 'Supabase SSR', 'Cron Automation'],
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 90).toISOString(),
  },
];

let inMemoryTestimonials: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Hendrik Pratama',
    client_role_company: 'COO at PT Nusantara Logistik Prima',
    content_id: 'Sistem ERP kustom buatan biru mengubah operasional gudang kami yang sebelumnya manual menjadi sangat teratur dan transparan. ROI terasa nyata dalam 3 bulan pertama!',
    content_en: 'The bespoke ERP platform created by biru transformed our previously fragmented warehouse operations into a well-oiled machine. Full ROI achieved within the first quarter!',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 80).toISOString(),
  },
  {
    id: 't2',
    client_name: 'Clara Salsabila',
    client_role_company: 'Head of Marketing at FinArtha Global',
    content_id: 'Website dan customer portal yang dibangun tim biru memiliki kecepatan kilat dan tampilan yang sangat mewah. Konversi prospek kami melonjak hingga 140%.',
    content_en: 'The website and client portal built by the biru team are blindingly fast and exquisitely designed. Our inbound lead conversions surged by 140%.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
  {
    id: 't3',
    client_name: 'Dimas Wicaksono',
    client_role_company: 'Founder & MD at Kultur Retail Group',
    content_id: 'Bukan sekadar agensi koding biasa, biru adalah partner konsultan teknologi sejati. Solusi automasi mereka menghemat ratusan jam kerja tim kami setiap bulannya.',
    content_en: 'Not just another coding vendor, biru is a true strategic technology partner. Their automation pipelines save our team hundreds of hours every single month.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
  },
];

let inMemoryTickets: Ticket[] = [
  {
    id: 'a0123456-789a-bcde-f012-3456789abcde',
    ticket_code: 'BIRU-1001',
    client_name: 'Budi Santoso',
    client_email: 'budi@nusantaralogistics.co.id',
    client_phone: '+6281234567890',
    service_type: 'custom_erp',
    budget_range: 'Rp 75 Juta - Rp 150 Juta (Advanced / Custom System)',
    description: 'Kebutuhan sistem ERP kustom untuk pemantauan armada truk 450 unit, tracking GPS, dan dispatching otomatis.',
    status: 'IN_REVIEW',
    admin_notes: 'Sudah diverifikasi oleh solution architect. Menunggu jadwal discovery call.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'b1234567-89ab-cdef-0123-456789abcdef',
    ticket_code: 'BIRU-1002',
    client_name: 'Amanda Putri',
    client_email: 'amanda@finarthapay.com',
    client_phone: '+6281987654321',
    service_type: 'custom_crm',
    budget_range: 'Rp 30 Juta - Rp 75 Juta (Medium / Specialized)',
    description: 'Portal onboarding merchant fintech dengan integrasi API e-KYC dan verifikasi rekening bank otomatis.',
    status: 'NEW',
    admin_notes: null,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'c2345678-9abc-def0-1234-56789abcdef0',
    ticket_code: 'BIRU-1003',
    client_name: 'Reza Pramana',
    client_email: 'reza@kopikultur.id',
    client_phone: '+6281311223344',
    service_type: 'custom_pos',
    budget_range: 'Rp 75 Juta - Rp 150 Juta (Advanced / Custom System)',
    description: 'Aplikasi POS multi-outlet offline-first dan sinkronisasi inventaris stok bahan baku biji kopi ke 28 gerai.',
    status: 'CONTACTED',
    admin_notes: 'Kontak WhatsApp sudah terhubung. Penawaran proposal resmi dikirim ke email reza@kopikultur.id.',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'd3456789-abcd-ef01-2345-6789abcdef01',
    ticket_code: 'BIRU-1004',
    client_name: 'Siti Rahmawati',
    client_email: 'siti@aeropulse.io',
    client_phone: '+6281765432109',
    service_type: 'automation',
    budget_range: 'Rp 30 Juta - Rp 75 Juta (Medium / Specialized)',
    description: 'Otomatisasi approval workflow tender dan integrasi bot WhatsApp interaktif serta webhook Google Sheet.',
    status: 'DEAL',
    admin_notes: 'Kontrak telah ditandatangani. Kickoff sprint dimulai hari Senin depan.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

let ticketSequence = 1005;

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && url.startsWith('http'));
}

// ==============================================================================
// 1. SERVICES REPOSITORY
// ==============================================================================
export async function fetchDynamicServices(): Promise<ServiceItem[]> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as ServiceItem[];
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return [...inMemoryServices];
}

export async function upsertService(input: ServiceInput, id?: string): Promise<{ success: boolean; service?: ServiceItem; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      if (id) {
        const { data, error } = await supabase
          .from('services')
          .update(input)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return { success: true, service: data as ServiceItem };
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert(input)
          .select()
          .single();
        if (!error && data) return { success: true, service: data as ServiceItem };
      }
    }

    if (id) {
      const idx = inMemoryServices.findIndex((s) => s.id === id);
      if (idx !== -1) {
        inMemoryServices[idx] = { ...inMemoryServices[idx], ...input };
        return { success: true, service: inMemoryServices[idx] };
      }
    } else {
      const newService: ServiceItem = {
        id: crypto.randomUUID(),
        ...input,
        created_at: new Date().toISOString(),
      };
      inMemoryServices.push(newService);
      return { success: true, service: newService };
    }
    return { success: false, error: 'Layanan tidak ditemukan' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteService(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      await supabase.from('services').delete().eq('id', id);
    }
    inMemoryServices = inMemoryServices.filter((s) => s.id !== id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 2. PORTFOLIO REPOSITORY
// ==============================================================================
export async function fetchDynamicPortfolio(): Promise<PortfolioItem[]> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as PortfolioItem[];
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return [...inMemoryPortfolio];
}

export async function upsertPortfolio(input: PortfolioInput, id?: string): Promise<{ success: boolean; portfolio?: PortfolioItem; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      if (id) {
        const { data, error } = await supabase
          .from('portfolio')
          .update(input)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return { success: true, portfolio: data as PortfolioItem };
      } else {
        const { data, error } = await supabase
          .from('portfolio')
          .insert(input)
          .select()
          .single();
        if (!error && data) return { success: true, portfolio: data as PortfolioItem };
      }
    }

    if (id) {
      const idx = inMemoryPortfolio.findIndex((p) => p.id === id);
      if (idx !== -1) {
        inMemoryPortfolio[idx] = { ...inMemoryPortfolio[idx], ...input };
        return { success: true, portfolio: inMemoryPortfolio[idx] };
      }
    } else {
      const newPortfolio: PortfolioItem = {
        id: crypto.randomUUID(),
        ...input,
        created_at: new Date().toISOString(),
      };
      inMemoryPortfolio.unshift(newPortfolio);
      return { success: true, portfolio: newPortfolio };
    }
    return { success: false, error: 'Portofolio tidak ditemukan' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deletePortfolio(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      await supabase.from('portfolio').delete().eq('id', id);
    }
    inMemoryPortfolio = inMemoryPortfolio.filter((p) => p.id !== id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 3. TESTIMONIALS REPOSITORY
// ==============================================================================
export async function fetchDynamicTestimonials(): Promise<Testimonial[]> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Testimonial[];
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return [...inMemoryTestimonials];
}

export async function upsertTestimonial(input: TestimonialInput, id?: string): Promise<{ success: boolean; testimonial?: Testimonial; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      if (id) {
        const { data, error } = await supabase
          .from('testimonials')
          .update(input)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return { success: true, testimonial: data as Testimonial };
      } else {
        const { data, error } = await supabase
          .from('testimonials')
          .insert(input)
          .select()
          .single();
        if (!error && data) return { success: true, testimonial: data as Testimonial };
      }
    }

    if (id) {
      const idx = inMemoryTestimonials.findIndex((t) => t.id === id);
      if (idx !== -1) {
        inMemoryTestimonials[idx] = { ...inMemoryTestimonials[idx], ...input };
        return { success: true, testimonial: inMemoryTestimonials[idx] };
      }
    } else {
      const newTestimonial: Testimonial = {
        id: crypto.randomUUID(),
        ...input,
        created_at: new Date().toISOString(),
      };
      inMemoryTestimonials.unshift(newTestimonial);
      return { success: true, testimonial: newTestimonial };
    }
    return { success: false, error: 'Testimoni tidak ditemukan' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      await supabase.from('testimonials').delete().eq('id', id);
    }
    inMemoryTestimonials = inMemoryTestimonials.filter((t) => t.id !== id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 4. TICKETS REPOSITORY
// ==============================================================================
export async function insertTicket(input: TicketSubmissionInput): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          client_name: input.client_name,
          client_email: input.client_email,
          client_phone: input.client_phone,
          service_type: input.service_type,
          budget_range: input.budget_range,
          description: input.description,
          status: 'NEW',
        })
        .select()
        .single();

      if (!error && data) {
        const ticket = data as Ticket;
        void sendTicketNotifications(ticket);
        return { success: true, ticket };
      }
    }

    const ticketCode = `BIRU-${ticketSequence++}`;
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      ticket_code: ticketCode,
      client_name: input.client_name,
      client_email: input.client_email,
      client_phone: input.client_phone,
      service_type: input.service_type,
      budget_range: input.budget_range,
      description: input.description,
      status: 'NEW',
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryTickets.unshift(newTicket);
    void sendTicketNotifications(newTicket);
    return { success: true, ticket: newTicket };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan tiket' };
  }
}

export async function fetchTickets(): Promise<{ tickets: Ticket[]; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return { tickets: data as Ticket[] };
      }
    }
    return { tickets: [...inMemoryTickets] };
  } catch (err: any) {
    return { tickets: [...inMemoryTickets], error: err.message };
  }
}

export async function updateTicketStatusAndNotes(
  id: string,
  status: TicketStatus,
  adminNotes?: string | null
): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      const { data, error } = await supabase
        .from('tickets')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return { success: true, ticket: data as Ticket };
      }
    }

    const index = inMemoryTickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      inMemoryTickets[index] = {
        ...inMemoryTickets[index],
        status,
        admin_notes: adminNotes ?? inMemoryTickets[index].admin_notes,
        updated_at: new Date().toISOString(),
      };
      return { success: true, ticket: inMemoryTickets[index] };
    }

    return { success: false, error: 'Tiket tidak ditemukan' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memperbarui tiket' };
  }
}
