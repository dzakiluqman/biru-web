'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Image from 'next/image';
import {
  Ticket,
  TicketStatus,
  ServiceItem,
  ServiceInput,
  PortfolioItem,
  PortfolioInput,
  Testimonial,
  TestimonialInput,
} from '@/types/database';
import { updateTicketAction } from '@/actions/tickets';
import {
  saveServiceAction,
  deleteServiceAction,
  savePortfolioAction,
  deletePortfolioAction,
  saveTestimonialAction,
  deleteTestimonialAction,
} from '@/actions/admin-management';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PhoneCall,
  CheckCheck,
  XCircle,
  X,
  Save,
  MessageCircle,
  Mail,
  Calendar,
  User,
  Plus,
  Trash2,
  Edit,
  Globe,
  Database,
  Layers,
  ShoppingBag,
  Cpu,
  Wrench,
  Star,
  ExternalLink,
} from 'lucide-react';

interface AdminConsoleClientProps {
  initialTickets: Ticket[];
  initialServices: ServiceItem[];
  initialPortfolio: PortfolioItem[];
  initialTestimonials: Testimonial[];
}

export default function AdminConsoleClient({
  initialTickets,
  initialServices,
  initialPortfolio,
  initialTestimonials,
}: AdminConsoleClientProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'tickets' | 'services' | 'portfolio' | 'testimonials'>('tickets');

  // DATA STATES
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // TRANSITION
  const [isPending, startTransition] = useTransition();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ============================================================================
  // TAB 1: TICKETS STATE & LOGIC
  // ============================================================================
  const [searchTicket, setSearchTicket] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('NEW');
  const [editNotes, setEditNotes] = useState<string>('');

  const ticketMetrics = useMemo(() => {
    return {
      total: tickets.length,
      newCount: tickets.filter((t) => t.status === 'NEW').length,
      inReviewCount: tickets.filter((t) => t.status === 'IN_REVIEW').length,
      contactedCount: tickets.filter((t) => t.status === 'CONTACTED').length,
      dealCount: tickets.filter((t) => t.status === 'DEAL').length,
      closedCount: tickets.filter((t) => t.status === 'CLOSED').length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.ticket_code.toLowerCase().includes(searchTicket.toLowerCase()) ||
        t.client_name.toLowerCase().includes(searchTicket.toLowerCase()) ||
        t.client_email.toLowerCase().includes(searchTicket.toLowerCase()) ||
        t.service_type.toLowerCase().includes(searchTicket.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, searchTicket, statusFilter]);

  const handleOpenTicketDrawer = (t: Ticket) => {
    setSelectedTicket(t);
    setEditStatus(t.status);
    setEditNotes(t.admin_notes || '');
  };

  const handleSaveTicket = () => {
    if (!selectedTicket) return;
    startTransition(async () => {
      const res = await updateTicketAction(selectedTicket.id, editStatus, editNotes);
      if (res.success && res.ticket) {
        setTickets((prev) => prev.map((item) => (item.id === selectedTicket.id ? res.ticket! : item)));
        setSelectedTicket(res.ticket);
        showToast('Status dan catatan tiket berhasil disimpan!');
      }
    });
  };

  // ============================================================================
  // TAB 2: SERVICES MODAL & LOGIC
  // ============================================================================
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceInput>({
    title_id: '',
    title_en: '',
    short_desc_id: '',
    short_desc_en: '',
    full_desc_id: '',
    full_desc_en: '',
    icon_name: 'Globe',
    is_active: true,
  });

  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      title_id: '',
      title_en: '',
      short_desc_id: '',
      short_desc_en: '',
      full_desc_id: '',
      full_desc_en: '',
      icon_name: 'Globe',
      is_active: true,
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (s: ServiceItem) => {
    setEditingServiceId(s.id);
    setServiceForm({
      title_id: s.title_id,
      title_en: s.title_en,
      short_desc_id: s.short_desc_id,
      short_desc_en: s.short_desc_en,
      full_desc_id: s.full_desc_id,
      full_desc_en: s.full_desc_en,
      icon_name: s.icon_name,
      is_active: s.is_active,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveServiceAction(serviceForm, editingServiceId || undefined);
      if (res.success && res.service) {
        if (editingServiceId) {
          setServices((prev) => prev.map((s) => (s.id === editingServiceId ? res.service! : s)));
          showToast('Layanan berhasil diperbarui!');
        } else {
          setServices((prev) => [...prev, res.service!]);
          showToast('Layanan baru berhasil ditambahkan!');
        }
        setServiceModalOpen(false);
      } else {
        alert(res.error || 'Gagal menyimpan layanan');
      }
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
    startTransition(async () => {
      const res = await deleteServiceAction(id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast('Layanan berhasil dihapus!');
      }
    });
  };

  // ============================================================================
  // TAB 3: PORTFOLIO MODAL & LOGIC
  // ============================================================================
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioInput>({
    title: '',
    slug: '',
    description_id: '',
    description_en: '',
    category: 'Custom System',
    image_url: '',
    live_url: '',
    tags: ['Next.js 16', 'TypeScript', 'PostgreSQL'],
    is_featured: true,
  });
  const [tagsInput, setTagsInput] = useState('Next.js 16, TypeScript, PostgreSQL');

  const handleOpenAddPortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioForm({
      title: '',
      slug: '',
      description_id: '',
      description_en: '',
      category: 'Custom System',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      live_url: '',
      tags: ['Next.js 16', 'TypeScript', 'Supabase'],
      is_featured: true,
    });
    setTagsInput('Next.js 16, TypeScript, Supabase');
    setPortfolioModalOpen(true);
  };

  const handleOpenEditPortfolio = (p: PortfolioItem) => {
    setEditingPortfolioId(p.id);
    setPortfolioForm({
      title: p.title,
      slug: p.slug,
      description_id: p.description_id,
      description_en: p.description_en,
      category: p.category,
      image_url: p.image_url,
      live_url: p.live_url || '',
      tags: p.tags,
      is_featured: p.is_featured,
    });
    setTagsInput(p.tags.join(', '));
    setPortfolioModalOpen(true);
  };

  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const dataToSave = { ...portfolioForm, tags: parsedTags };

    startTransition(async () => {
      const res = await savePortfolioAction(dataToSave, editingPortfolioId || undefined);
      if (res.success && res.portfolio) {
        if (editingPortfolioId) {
          setPortfolio((prev) => prev.map((p) => (p.id === editingPortfolioId ? res.portfolio! : p)));
          showToast('Proyek portofolio berhasil diperbarui!');
        } else {
          setPortfolio((prev) => [res.portfolio!, ...prev]);
          showToast('Proyek baru berhasil ditambahkan!');
        }
        setPortfolioModalOpen(false);
      } else {
        alert(res.error || 'Gagal menyimpan portofolio');
      }
    });
  };

  const handleDeletePortfolio = (id: string) => {
    if (!confirm('Hapus proyek ini dari portofolio?')) return;
    startTransition(async () => {
      const res = await deletePortfolioAction(id);
      if (res.success) {
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
        showToast('Proyek berhasil dihapus!');
      }
    });
  };

  // ============================================================================
  // TAB 4: TESTIMONIALS MODAL & LOGIC
  // ============================================================================
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialInput>({
    client_name: '',
    client_role_company: '',
    content_id: '',
    content_en: '',
    avatar_url: '',
    rating: 5,
    is_featured: true,
  });

  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      client_name: '',
      client_role_company: '',
      content_id: '',
      content_en: '',
      avatar_url: '',
      rating: 5,
      is_featured: true,
    });
    setTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      client_name: t.client_name,
      client_role_company: t.client_role_company,
      content_id: t.content_id,
      content_en: t.content_en,
      avatar_url: t.avatar_url || '',
      rating: t.rating,
      is_featured: t.is_featured,
    });
    setTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveTestimonialAction(testimonialForm, editingTestimonialId || undefined);
      if (res.success && res.testimonial) {
        if (editingTestimonialId) {
          setTestimonials((prev) => prev.map((t) => (t.id === editingTestimonialId ? res.testimonial! : t)));
          showToast('Testimoni berhasil diperbarui!');
        } else {
          setTestimonials((prev) => [res.testimonial!, ...prev]);
          showToast('Testimoni baru berhasil ditambahkan!');
        }
        setTestimonialModalOpen(false);
      } else {
        alert(res.error || 'Gagal menyimpan testimoni');
      }
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    startTransition(async () => {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        showToast('Testimoni berhasil dihapus!');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Admin Title & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Konsol Manajemen biru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola tiket klien, layanan, portofolio karya, dan testimoni secara terpusat via Supabase.
          </p>
        </div>

        {/* 4 Tabs switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tickets' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tiket ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'services' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Layanan ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'portfolio' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portofolio ({portfolio.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Testimoni ({testimonials.length})
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* TAB 1: TICKETS MANAGEMENT                                             */}
      {/* ====================================================================== */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div
              onClick={() => setStatusFilter('ALL')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'ALL' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Total</span>
                <Inbox className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.total}</div>
            </div>

            <div
              onClick={() => setStatusFilter('NEW')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'NEW' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-blue-600 mb-2">
                <span className="text-xs font-bold uppercase">Baru</span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.newCount}</div>
            </div>

            <div
              onClick={() => setStatusFilter('IN_REVIEW')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'IN_REVIEW' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-amber-600 mb-2">
                <span className="text-xs font-bold uppercase">In Review</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.inReviewCount}</div>
            </div>

            <div
              onClick={() => setStatusFilter('CONTACTED')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'CONTACTED' ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-cyan-600 mb-2">
                <span className="text-xs font-bold uppercase">Contacted</span>
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.contactedCount}</div>
            </div>

            <div
              onClick={() => setStatusFilter('DEAL')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'DEAL' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <span className="text-xs font-bold uppercase">Deals</span>
                <CheckCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.dealCount}</div>
            </div>

            <div
              onClick={() => setStatusFilter('CLOSED')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                statusFilter === 'CLOSED' ? 'border-slate-500 bg-slate-100' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase">Closed</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900">{ticketMetrics.closedCount}</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Cari kode, nama, atau email..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600 font-semibold">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Status ({ticketMetrics.total})</option>
                <option value="NEW">NEW ({ticketMetrics.newCount})</option>
                <option value="IN_REVIEW">IN REVIEW ({ticketMetrics.inReviewCount})</option>
                <option value="CONTACTED">CONTACTED ({ticketMetrics.contactedCount})</option>
                <option value="DEAL">DEAL ({ticketMetrics.dealCount})</option>
                <option value="CLOSED">CLOSED ({ticketMetrics.closedCount})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">Kode Tiket</th>
                    <th className="p-4">Klien & Kontak</th>
                    <th className="p-4">Layanan</th>
                    <th className="p-4">Anggaran</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Waktu Masuk</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Tidak ada tiket yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => handleOpenTicketDrawer(t)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 font-mono font-bold text-blue-600">
                          {t.ticket_code}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{t.client_name}</div>
                          <div className="text-xs text-slate-500">{t.client_email}</div>
                        </td>
                        <td className="p-4 text-slate-700 capitalize">
                          {t.service_type.replace('_', ' ')}
                        </td>
                        <td className="p-4 text-slate-600 max-w-[180px] truncate" title={t.budget_range}>
                          {t.budget_range}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            t.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                            t.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' :
                            t.status === 'CONTACTED' ? 'bg-cyan-100 text-cyan-700' :
                            t.status === 'DEAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 font-mono">
                          {new Date(t.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTicketDrawer(t);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Buka Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: SERVICES MANAGEMENT                                            */}
      {/* ====================================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Layanan Digital (Supabase)</h2>
              <p className="text-xs text-slate-500">Layanan yang aktif akan ditampilkan pada halaman publik.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddService}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {s.icon_name}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {s.is_active ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">{s.title_id}</h3>
                  <div className="text-xs text-slate-500 mb-2 font-medium italic">{s.title_en}</div>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">{s.short_desc_id}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditService(s)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(s.id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 3: PORTFOLIO MANAGEMENT                                           */}
      {/* ====================================================================== */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manajemen Portofolio Karya (Supabase)</h2>
              <p className="text-xs text-slate-500">Proyek yang aktif akan tampil di `/portfolio` dan showcase beranda.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddPortfolio}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-blue-700 shadow-xs">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-base text-slate-900 mb-1">{p.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{p.description_id}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPortfolio(p)}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(p.id)}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 4: TESTIMONIALS MANAGEMENT                                        */}
      {/* ====================================================================== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manajemen Testimoni Klien (Supabase)</h2>
              <p className="text-xs text-slate-500">Testimoni resmi yang diinput oleh administrator untuk social proof.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddTestimonial}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Testimoni Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((tItem) => (
              <div key={tItem.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(tItem.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tItem.is_featured ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {tItem.is_featured ? 'Featured' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic mb-4 leading-relaxed line-clamp-3">
                    &ldquo;{tItem.content_id}&rdquo;
                  </p>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{tItem.client_name}</h4>
                    <p className="text-xs text-slate-500">{tItem.client_role_company}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEditTestimonial(tItem)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(tItem.id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TICKET DETAILS DRAWER                                                 */}
      {/* ====================================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                    Tiket: {selectedTicket.ticket_code}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    Detail & Status Tiket
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold text-slate-900">{selectedTicket.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedTicket.client_email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedTicket.client_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedTicket.client_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat WA</span>
                  </a>
                </div>
                <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  Diajukan: {new Date(selectedTicket.created_at).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Deskripsi Kebutuhan Klien
                </label>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedTicket.description}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ubah Status Tiket
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NEW', 'IN_REVIEW', 'CONTACTED', 'DEAL', 'CLOSED'] as TicketStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        editStatus === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Internal Admin (Admin Notes)
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tambahkan catatan tindak lanjut atau progres kontrak..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Tutup Panel
              </button>

              <button
                type="button"
                onClick={handleSaveTicket}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SERVICE ADD/EDIT MODAL                                                */}
      {/* ====================================================================== */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingServiceId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <button type="button" onClick={() => setServiceModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Layanan (ID)</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title_id}
                  onChange={(e) => setServiceForm({ ...serviceForm, title_id: e.target.value })}
                  placeholder="cth. Website Enterprise & Portal"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Layanan (EN)</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title_en}
                  onChange={(e) => setServiceForm({ ...serviceForm, title_en: e.target.value })}
                  placeholder="e.g. Enterprise Websites & Portals"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat (ID)</label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.short_desc_id}
                  onChange={(e) => setServiceForm({ ...serviceForm, short_desc_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat (EN)</label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.short_desc_en}
                  onChange={(e) => setServiceForm({ ...serviceForm, short_desc_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap (ID)</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.full_desc_id}
                  onChange={(e) => setServiceForm({ ...serviceForm, full_desc_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap (EN)</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.full_desc_en}
                  onChange={(e) => setServiceForm({ ...serviceForm, full_desc_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Icon Lucide</label>
                  <select
                    value={serviceForm.icon_name}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                  >
                    <option value="Globe">Globe</option>
                    <option value="Database">Database</option>
                    <option value="Layers">Layers</option>
                    <option value="ShoppingBag">ShoppingBag</option>
                    <option value="Cpu">Cpu</option>
                    <option value="Wrench">Wrench</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active_cb"
                    checked={serviceForm.is_active}
                    onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="is_active_cb" className="font-bold text-slate-700">Status Aktif</label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* PORTFOLIO ADD/EDIT MODAL                                              */}
      {/* ====================================================================== */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingPortfolioId ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
              <button type="button" onClick={() => setPortfolioModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Proyek</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                  placeholder="cth. Nusantara Logistics ERP"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.slug}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, slug: e.target.value })}
                  placeholder="cth. nusantara-logistics-erp"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={portfolioForm.category}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                >
                  <option value="Custom System">Custom System</option>
                  <option value="Web Profile">Web Profile</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Gambar (Unsplash/CDN)</label>
                <input
                  type="url"
                  required
                  value={portfolioForm.image_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Demo / Website (Opsional)</label>
                <input
                  type="url"
                  value={portfolioForm.live_url || ''}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, live_url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Proyek (ID)</label>
                <textarea
                  rows={2}
                  required
                  value={portfolioForm.description_id}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Proyek (EN)</label>
                <textarea
                  rows={2}
                  required
                  value={portfolioForm.description_en}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teknologi / Tags (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js 16, TypeScript, Supabase, Tailwind"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TESTIMONIAL ADD/EDIT MODAL                                            */}
      {/* ====================================================================== */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingTestimonialId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h3>
              <button type="button" onClick={() => setTestimonialModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Klien</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.client_name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, client_name: e.target.value })}
                  placeholder="cth. Hendrik Pratama"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan & Perusahaan</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.client_role_company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, client_role_company: e.target.value })}
                  placeholder="cth. COO at PT Nusantara Logistik Prima"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konten Testimoni (ID)</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.content_id}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konten Testimoni (EN)</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.content_en}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rating (1 - 5 Bintang)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    required
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Foto Profil (Opsional)</label>
                  <input
                    type="url"
                    value={testimonialForm.avatar_url || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
