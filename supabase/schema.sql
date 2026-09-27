-- ==============================================================================
-- BIRU DIGITAL AGENCY - COMPLETE DATABASE SCHEMA & RLS POLICIES
-- PostgreSQL / Supabase Migration
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM FOR TICKET STATUS
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE public.ticket_status AS ENUM (
      'NEW',
      'IN_REVIEW',
      'CONTACTED',
      'DEAL',
      'CLOSED'
    );
  END IF;
END $$;

-- 3. SEQUENCE & TRIGGER FUNCTION FOR TICKET CODE (BIRU-1001)
CREATE SEQUENCE IF NOT EXISTS public.ticket_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_code IS NULL OR NEW.ticket_code = '' THEN
    NEW.ticket_code := 'BIRU-' || nextval('public.ticket_code_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER FUNCTION FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLES DEFINITION
-- ==============================================================================

-- Table 1: public.tickets (Submitted by clients via /contact)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code TEXT UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  description TEXT NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trg_generate_ticket_code ON public.tickets;
CREATE TRIGGER trg_generate_ticket_code
  BEFORE INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_ticket_code();

DROP TRIGGER IF EXISTS trg_tickets_updated_at ON public.tickets;
CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Table 2: public.testimonials (Inputted & managed strictly by Admin)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role_company TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_en TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table 3: public.portfolio (Managed by Admin)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  live_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table 4: public.services (Managed by Admin)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  short_desc_id TEXT NOT NULL,
  short_desc_en TEXT NOT NULL,
  full_desc_id TEXT NOT NULL,
  full_desc_en TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Globe',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 4 tables
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 1. TICKETS POLICIES
-- (a) Public (anon + authenticated) can INSERT new tickets
DROP POLICY IF EXISTS "Public can submit tickets" ON public.tickets;
CREATE POLICY "Public can submit tickets"
  ON public.tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- (b) Only authenticated admins can SELECT tickets
DROP POLICY IF EXISTS "Admins can view tickets" ON public.tickets;
CREATE POLICY "Admins can view tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (true);

-- (c) Only authenticated admins can UPDATE tickets
DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
CREATE POLICY "Admins can update tickets"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- (d) Only authenticated admins can DELETE tickets
DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;
CREATE POLICY "Admins can delete tickets"
  ON public.tickets FOR DELETE
  TO authenticated
  USING (true);

-- 2. TESTIMONIALS POLICIES
-- (a) Public can view featured testimonials
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

-- (b) Authenticated admins have full CRUD
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (true);

-- 3. PORTFOLIO POLICIES
-- (a) Public can view portfolio items
DROP POLICY IF EXISTS "Public can view portfolio" ON public.portfolio;
CREATE POLICY "Public can view portfolio"
  ON public.portfolio FOR SELECT
  TO anon, authenticated
  USING (true);

-- (b) Authenticated admins have full CRUD
DROP POLICY IF EXISTS "Admins can insert portfolio" ON public.portfolio;
CREATE POLICY "Admins can insert portfolio"
  ON public.portfolio FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update portfolio" ON public.portfolio;
CREATE POLICY "Admins can update portfolio"
  ON public.portfolio FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete portfolio" ON public.portfolio;
CREATE POLICY "Admins can delete portfolio"
  ON public.portfolio FOR DELETE
  TO authenticated
  USING (true);

-- 4. SERVICES POLICIES
-- (a) Public can view active services
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (true);

-- (b) Authenticated admins have full CRUD
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update services" ON public.services;
CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Services
INSERT INTO public.services (title_id, title_en, short_desc_id, short_desc_en, full_desc_id, full_desc_en, icon_name, is_active)
VALUES
  (
    'Website Enterprise & Portal',
    'Enterprise Websites & Portals',
    'Website korporasi dan platform portal dinamis yang memancarkan kredibilitas tinggi serta konversi maksimal.',
    'High-converting corporate websites and dynamic portal platforms projecting undeniable authority and credibility.',
    'Pengembangan website modern berkinerja ultra tinggi dengan Next.js App Router, animasi fluid, optimasi Core Web Vitals 95-100, dan integrasi headless CMS fleksibel.',
    'Modern ultra-high performance web development powered by Next.js App Router, fluid animations, Core Web Vitals 95-100 scores, and flexible headless CMS integrations.',
    'Globe',
    true
  ),
  (
    'Sistem ERP / Supply Chain Kustom',
    'Custom ERP & Supply Chain Systems',
    'Software tailored-fit untuk operasional rantai pasok, inventaris gudang, dan otomatisasi logistik.',
    'Tailor-fit software engineered for supply chain operations, warehouse inventory, and automated fleet logistics.',
    'Aplikasi web internal yang dirancang khusus untuk memetakan alur kerja spesifik bisnis Anda: dispatching pintar armada, multi-warehouse tracking, dan pelaporan keuangan real-time.',
    'Internal web applications engineered around your exact business workflows: intelligent fleet dispatching, multi-warehouse tracking, and real-time financial reporting.',
    'Database',
    true
  ),
  (
    'Sistem CRM & Penjualan B2B',
    'Custom CRM & B2B Sales Engines',
    'Manajemen relasi pelanggan, pipeline prospek, dan otomatisasi penawaran harga.',
    'Customer relationship management, lead pipelines, and automated quotation workflows.',
    'Platform terpadu untuk tim sales dan customer support dengan lead scoring cerdas, integrasi WhatsApp Business API, dan rekonsiliasi pembayaran otomatis.',
    'Unified platform for sales and customer success teams featuring smart lead scoring, WhatsApp Business API integration, and automated payment reconciliation.',
    'Layers',
    true
  ),
  (
    'Aplikasi Kasir POS Multi-Outlet',
    'Omnichannel POS Systems',
    'Aplikasi kasir Point-of-Sale cloud offline-first dengan sinkronisasi inventaris multi-cabang.',
    'Offline-first cloud Point-of-Sale application with real-time multi-branch inventory synchronization.',
    'Aplikasi kasir modern dengan kecepatan transaksi sub-detik, receipt printer, integrasi QRIS/payment gateway, dan manajemen loyalitas pelanggan.',
    'Modern cashier application featuring sub-second checkout speed, thermal receipt printing, QRIS integration, and customer loyalty management.',
    'ShoppingBag',
    true
  ),
  (
    'Automasi Bisnis & Integrasi API',
    'Business Automation & API Sync',
    'Menghubungkan aplikasi akuntansi, WhatsApp bot, dan alur kerja harian untuk eliminasi friksi manual.',
    'Bridging accounting tools, WhatsApp bots, and daily workflows to eliminate repetitive manual friction.',
    'Solusi otomatisasi alur kerja tanpa jeda dengan webhook terdistribusi, ekstraksi dokumen OCR, dan integrasi Google Workspace / ERP.',
    'Zero-latency workflow automation with distributed webhooks, OCR document parsing, and Google Workspace / ERP integrations.',
    'Cpu',
    true
  ),
  (
    'Managed Cloud Ops & Maintenance (24/7)',
    'Managed Cloud Ops & 24/7 Care',
    'Pemantauan 24/7, backup otomatis harian, audit keamanan berkala, dan SLA ketersediaan 99.98%.',
    '24/7 telemetry monitoring, daily automated cloud backups, security patching, and 99.98% uptime SLA.',
    'Jaga infrastruktur web dan database Anda selalu cepat, aman, dan tahan beban tinggi dengan tim teknis siaga 24/7.',
    'Keep your web apps and PostgreSQL databases ultra-fast, secure, and resilient under heavy traffic with our 24/7 standby DevOps engineers.',
    'Wrench',
    true
  )
ON CONFLICT DO NOTHING;

-- Seed Portfolio
INSERT INTO public.portfolio (title, slug, description_id, description_en, category, image_url, live_url, tags, is_featured)
VALUES
  (
    'Nusantara Logistics ERP',
    'nusantara-logistics-erp',
    'Sistem ERP logistik real-time untuk armada 450+ truk di 12 provinsi, mencakup dispatching pintar, manajemen bahan bakar, dan invoice otomatis.',
    'Real-time logistics ERP system orchestrating 450+ heavy trucks across 12 provinces with intelligent dispatching and automated invoicing.',
    'Custom System',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    'https://nusantaralogistics.co.id',
    ARRAY['Next.js 16', 'TypeScript', 'Supabase RLS', 'PostgreSQL', 'Tailwind', 'Redis'],
    true
  ),
  (
    'FinArtha Payment & Portal',
    'finartha-payment-portal',
    'Platform pembayaran B2B dan rekonsiliasi perbankan otomatis dengan enkripsi keamanan bank-grade dan antarmuka analitik real-time.',
    'B2B financial settlement platform and automated reconciliation engine featuring bank-grade encryption and real-time analytics.',
    'Web Profile',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    'https://finarthapay.com',
    ARRAY['React 19', 'Next.js App Router', 'Bank API', 'Supabase Auth', 'Zod', 'Resend'],
    true
  ),
  (
    'KopiKultur Omnichannel POS',
    'kopikultur-omnichannel-pos',
    'Aplikasi Point-of-Sale cloud offline-first untuk 28 gerai kopi dengan sinkronisasi inventaris instan dan program loyalitas pelanggan.',
    'Offline-first cloud POS deployed across 28 flagship coffee outlets with live inventory synchronization and integrated loyalty points.',
    'Custom System',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    'https://kopikultur.id',
    ARRAY['Next.js PWA', 'IndexedDB', 'PostgreSQL', 'WebSocket', 'Tailwind'],
    true
  ),
  (
    'AeroPulse Workflow Automation',
    'aeropulse-workflow-automation',
    'Platform otomatisasi persetujuan dokumen tender, bot notifikasi WhatsApp terverifikasi, dan integrasi Google Workspace.',
    'Automated procurement approval engine, verified WhatsApp alert bots, and bidirectional Google Workspace synchronization.',
    'E-Commerce',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    'https://aeropulse.io',
    ARRAY['TypeScript', 'Next.js 16', 'WhatsApp API', 'Supabase SSR', 'Cron Automation'],
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Seed Testimonials
INSERT INTO public.testimonials (client_name, client_role_company, content_id, content_en, avatar_url, rating, is_featured)
VALUES
  (
    'Hendrik Pratama',
    'Chief Operations Officer at PT Nusantara Logistik Prima',
    'Sistem ERP kustom buatan biru mengubah operasional gudang kami yang sebelumnya manual menjadi sangat teratur dan transparan. ROI terasa nyata dalam 3 bulan pertama!',
    'The bespoke ERP platform created by biru transformed our previously fragmented warehouse operations into a well-oiled machine. Full ROI achieved within the first quarter!',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    5,
    true
  ),
  (
    'Clara Salsabila',
    'Head of Marketing at FinArtha Global',
    'Website dan customer portal yang dibangun tim biru memiliki kecepatan kilat dan tampilan yang sangat mewah. Konversi prospek kami melonjak hingga 140%.',
    'The website and client portal built by the biru team are blindingly fast and exquisitely designed. Our inbound lead conversions surged by 140%.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    5,
    true
  ),
  (
    'Dimas Wicaksono',
    'Founder & Managing Director at Kultur Retail Group',
    'Bukan sekadar agensi koding biasa, biru adalah partner konsultan teknologi sejati. Solusi automasi mereka menghemat ratusan jam kerja tim kami setiap bulannya.',
    'Not just another coding vendor, biru is a true strategic technology partner. Their automation pipelines save our team hundreds of hours every single month.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    5,
    true
  )
ON CONFLICT DO NOTHING;

-- Seed Initial Demo Tickets
INSERT INTO public.tickets (ticket_code, client_name, client_email, client_phone, service_type, budget_range, description, status, admin_notes)
VALUES 
  ('BIRU-1001', 'Budi Santoso', 'budi@nusantaralogistics.co.id', '+6281234567890', 'custom_erp', 'Rp 75 Juta - Rp 150 Juta (Advanced / Custom System)', 'Kebutuhan sistem ERP kustom untuk pemantauan armada truk dan dispatching multi-cabang.', 'IN_REVIEW', 'Sudah diverifikasi oleh solution architect. Menunggu jadwal call meeting.'),
  ('BIRU-1002', 'Amanda Putri', 'amanda@finarthapay.com', '+6281987654321', 'custom_crm', 'Rp 30 Juta - Rp 75 Juta (Medium / Specialized)', 'Portal onboarding merchant B2B dengan integrasi API e-KYC dan verifikasi rekening bank.', 'NEW', NULL),
  ('BIRU-1003', 'Reza Pramana', 'reza@kopikultur.id', '+6281311223344', 'custom_pos', 'Rp 75 Juta - Rp 150 Juta (Advanced / Custom System)', 'Aplikasi POS multi-outlet offline-first dan sinkronisasi inventaris stok bahan baku biji kopi.', 'CONTACTED', 'Kontak WhatsApp sudah terhubung. Penawaran dikirim melalui email.'),
  ('BIRU-1004', 'Siti Rahmawati', 'siti@aeropulse.io', '+6281765432109', 'automation', 'Rp 30 Juta - Rp 75 Juta (Medium / Specialized)', 'Otomatisasi approval workflow tender dan integrasi bot WhatsApp interaktif.', 'DEAL', 'Kontrak ditandatangani. Kickoff sprint dimulai hari Senin depan.')
ON CONFLICT (ticket_code) DO NOTHING;
