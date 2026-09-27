'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { Ticket, TicketStatus } from '@/types/ticket';
import { updateTicketAction } from '@/actions/tickets';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PhoneCall,
  CheckCheck,
  XCircle,
  FileText,
  X,
  Save,
  MessageCircle,
  Mail,
  Calendar,
  DollarSign,
  User,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

interface TicketDashboardClientProps {
  initialTickets: Ticket[];
}

export default function TicketDashboardClient({ initialTickets }: TicketDashboardClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer form state
  const [editStatus, setEditStatus] = useState<TicketStatus>('NEW');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isUpdating, startUpdateTransition] = useTransition();
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Compute Metrics
  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      newCount: tickets.filter((t) => t.status === 'NEW').length,
      inReviewCount: tickets.filter((t) => t.status === 'IN_REVIEW').length,
      contactedCount: tickets.filter((t) => t.status === 'CONTACTED').length,
      dealCount: tickets.filter((t) => t.status === 'DEAL').length,
      closedCount: tickets.filter((t) => t.status === 'CLOSED').length,
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.service_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const handleOpenDrawer = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditNotes(ticket.admin_notes || '');
    setSaveSuccessMsg(false);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTicket(null);
  };

  const handleSaveStatusAndNotes = () => {
    if (!selectedTicket) return;

    startUpdateTransition(async () => {
      const res = await updateTicketAction(selectedTicket.id, editStatus, editNotes);
      if (res.success && res.ticket) {
        // Update local state
        setTickets((prev) =>
          prev.map((t) => (t.id === selectedTicket.id ? res.ticket! : t))
        );
        setSelectedTicket(res.ticket);
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3000);
      }
    });
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            NEW
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800">
            <Clock className="w-3 h-3" />
            IN REVIEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
            <PhoneCall className="w-3 h-3" />
            CONTACTED
          </span>
        );
      case 'DEAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCheck className="w-3 h-3" />
            DEAL
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-400 border border-slate-700">
            <XCircle className="w-3 h-3" />
            CLOSED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Console Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Konsol Manajemen Tiket Proyek
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau, tindak lanjuti, dan perbarui status tiket klien secara real-time.
          </p>
        </div>
      </div>

      {/* METRICS CARDS (Total, New, In Review, Contacted, Deals, Closed) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'ALL'
              ? 'border-blue-500 bg-slate-900'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.total}</div>
        </div>

        {/* New */}
        <div
          onClick={() => setStatusFilter('NEW')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'NEW'
              ? 'border-blue-500 bg-blue-950/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase">Baru</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.newCount}</div>
        </div>

        {/* In Review */}
        <div
          onClick={() => setStatusFilter('IN_REVIEW')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'IN_REVIEW'
              ? 'border-amber-500 bg-amber-950/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase">In Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.inReviewCount}</div>
        </div>

        {/* Contacted */}
        <div
          onClick={() => setStatusFilter('CONTACTED')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'CONTACTED'
              ? 'border-cyan-500 bg-cyan-950/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase">Contacted</span>
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.contactedCount}</div>
        </div>

        {/* Deals */}
        <div
          onClick={() => setStatusFilter('DEAL')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'DEAL'
              ? 'border-emerald-500 bg-emerald-950/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase">Deals</span>
            <CheckCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.dealCount}</div>
        </div>

        {/* Closed */}
        <div
          onClick={() => setStatusFilter('CLOSED')}
          className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'CLOSED'
              ? 'border-slate-600 bg-slate-900'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Closed</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.closedCount}</div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari kode, nama, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Status ({metrics.total})</option>
            <option value="NEW">NEW ({metrics.newCount})</option>
            <option value="IN_REVIEW">IN REVIEW ({metrics.inReviewCount})</option>
            <option value="CONTACTED">CONTACTED ({metrics.contactedCount})</option>
            <option value="DEAL">DEAL ({metrics.dealCount})</option>
            <option value="CLOSED">CLOSED ({metrics.closedCount})</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Kode Tiket</th>
                <th className="p-4">Klien & Kontak</th>
                <th className="p-4">Layanan</th>
                <th className="p-4">Anggaran</th>
                <th className="p-4">Status</th>
                <th className="p-4">Waktu Masuk</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada tiket yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleOpenDrawer(t)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    {/* Ticket Code */}
                    <td className="p-4 font-mono font-bold text-blue-400 group-hover:text-blue-300">
                      {t.ticket_code}
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <div className="font-bold text-white">{t.client_name}</div>
                      <div className="text-xs text-slate-400">{t.client_email}</div>
                    </td>

                    {/* Service */}
                    <td className="p-4 text-slate-300">
                      <span className="capitalize">{t.service_type.replace('_', ' ')}</span>
                    </td>

                    {/* Budget */}
                    <td className="p-4 text-slate-300 max-w-[180px] truncate" title={t.budget_range}>
                      {t.budget_range}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-xs text-slate-400 font-mono">
                      {new Date(t.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(t);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white text-xs font-semibold transition-colors cursor-pointer"
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

      {/* STATUS UPDATE DRAWER / MODAL */}
      {drawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                    Tiket: {selectedTicket.ticket_code}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Detail & Status Tiket
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Status dan catatan berhasil diperbarui!</span>
                </div>
              )}

              {/* Client Dossier */}
              <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-white">{selectedTicket.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedTicket.client_email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedTicket.client_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedTicket.client_phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedTicket.client_name)}%2C%20kami%20dari%20tim%20biru%20mengenai%20tiket%20${selectedTicket.ticket_code}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat WA</span>
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    Masuk: {new Date(selectedTicket.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Scope & Requirement Narrative */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Deskripsi Kebutuhan Klien
                </label>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                  {selectedTicket.description}
                </div>
              </div>

              {/* STATUS SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Ubah Status Tiket
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['NEW', 'IN_REVIEW', 'CONTACTED', 'DEAL', 'CLOSED'] as TicketStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        editStatus === st
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* ADMIN NOTES TEXTAREA */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Catatan Internal Admin (Admin Notes)
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tambahkan catatan tindak lanjut, kesepakatan meeting, atau progres kontrak..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup Panel
              </button>

              <button
                type="button"
                onClick={handleSaveStatusAndNotes}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
