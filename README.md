# biru — Modern Digital Agency Platform

> Enterprise-grade web application for **biru**, a modern digital agency specializing in high-performance website development, bespoke digital systems (ERP / CRM / POS), and intelligent business automation.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism UI tokens + Lucide Icons + Framer Motion
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL Cloud) + `@supabase/ssr` + Supabase Auth
- **Multi-Language (i18n)**: `next-intl` with localized subpaths (`/id` and `/en`)
- **Forms & Validation**: React Hook Form + Zod (`ticketSubmissionSchema`)
- **Email Service**: Resend API integration for automatic ticket confirmations and admin alerts
- **Security**: Row Level Security (RLS) enabled on `public.tickets` (anon can insert; authenticated admins can read/update)

---

## 🚀 Live Routes

### Public Localized Routes (`/[locale]/`)
| Route | Description |
|---|---|
| `/[locale]` | **Home**: Hero section, Value Propositions (Speed, Security, SEO, Modern UX), Services Showcase, Portfolio with live preview modal, 4-step workflow, and client testimonials |
| `/[locale]/services` | **Services**: In-depth breakdowns of all 4 service categories + Feature Comparison Matrix table (`Starter`, `Growth`, `Enterprise`) |
| `/[locale]/about` | **About Us**: Company story, mission & vision, core principles, and interactive tech stack showcase |
| `/[locale]/contact` | **Contact & Ticket Submission**: Interactive form with React Hook Form + Zod, returns unique `ticket_code` (e.g. `BIRU-1001`), copyable ticket ID, and direct WhatsApp fast-track |

### Admin Area (Non-localized)
| Route | Description |
|---|---|
| `/admin/login` | Secure login via Supabase Auth + 1-click Demo Credentials mode |
| `/admin/dashboard` | Protected command console with real-time metrics cards, search & filterable tickets table, and slide-over status & admin notes editor |

---

## 🗄️ Supabase Database Schema

The complete PostgreSQL migration script is located at:
[`supabase/schema.sql`](./supabase/schema.sql)

It configures:
1. `ticket_status` ENUM (`NEW`, `IN_REVIEW`, `CONTACTED`, `DEAL`, `CLOSED`)
2. Auto-increment sequence `public.ticket_code_seq START WITH 1001`
3. Trigger generating `BIRU-xxxx` ticket codes
4. `public.tickets` table with `created_at` and `updated_at` triggers
5. Row Level Security (RLS) policies allowing public anon INSERT and authenticated admin SELECT/UPDATE

---

## 🔑 Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend API Key
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=biru Agency <onboarding@resend.dev>
ADMIN_NOTIFICATION_EMAIL=support@biru.agency

# Demo Admin Credentials (for evaluation & fallback mode)
ADMIN_DEMO_EMAIL=admin@biru.agency
ADMIN_DEMO_PASSWORD=biru2026!
```

---

## 🛠️ Development & Production

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build production bundle (tested with Next.js 16 App Router)
npm run build

# Start production server
npm run start
```
