'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSubmissionSchema, TicketSubmissionInput, Ticket } from '@/types/database';
import { submitTicketAction } from '@/actions/tickets';
import { useTranslations } from 'next-intl';
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface TicketFormProps {
  locale: string;
  defaultService?: string;
}

export default function TicketForm({ locale, defaultService }: TicketFormProps) {
  const t = useTranslations('contact');
  const [isPending, startTransition] = useTransition();
  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketSubmissionInput>({
    resolver: zodResolver(ticketSubmissionSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      service_type: defaultService || '',
      budget_range: '',
      description: '',
    },
  });

  const onSubmit = (values: TicketSubmissionInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await submitTicketAction(values);
        if (result.success && result.ticket) {
          setSubmittedTicket(result.ticket);
        } else {
          setServerError(result.error || 'Terjadi kendala saat menerbitkan tiket.');
        }
      } catch (err: any) {
        setServerError(err.message || 'Koneksi terputus. Silakan coba lagi.');
      }
    });
  };

  const handleCopyCode = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setServerError(null);
    reset();
  };

  // SUCCESS STATE VIEW
  if (submittedTicket) {
    const waMessage = encodeURIComponent(
      `Halo tim biru, saya telah menerbitkan tiket dengan kode ${submittedTicket.ticket_code} atas nama ${submittedTicket.client_name} untuk layanan ${submittedTicket.service_type}. Mohon konfirmasi jadwal discovery session.`
    );
    const waUrl = `https://wa.me/6281192837722?text=${waMessage}`;

    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-300 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            {t('success.title')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Tiket Resmi Terbit
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            {t('success.subtitle')}
          </p>
        </div>

        {/* Copyable Ticket ID Box */}
        <div className="bg-blue-50/60 border-2 border-dashed border-blue-400 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
            {t('success.ticketLabel')}
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-blue-700 tracking-wider my-2">
            {submittedTicket.ticket_code}
          </div>

          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t('success.copySuccess')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode Tiket</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Next Steps List */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-xs sm:text-sm text-slate-700 space-y-2.5">
          <div className="font-bold text-slate-900 text-sm mb-1">{t('success.nextStepsTitle')}</div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>{t('success.step1')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>{t('success.step2')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>{t('success.step3')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('success.waButton')}</span>
          </a>

          <button
            type="button"
            onClick={handleResetForm}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('success.newTicket')}</span>
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT FORM VIEW (Light Mode)
  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('form.nameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('form.namePlaceholder')}
            {...register('client_name')}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.client_name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          {errors.client_name && (
            <p className="text-xs text-red-600 mt-1">{errors.client_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('form.emailLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder={t('form.emailPlaceholder')}
              {...register('client_email')}
              disabled={isPending}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                errors.client_email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.client_email && (
              <p className="text-xs text-red-600 mt-1">{errors.client_email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('form.phoneLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t('form.phonePlaceholder')}
              {...register('client_phone')}
              disabled={isPending}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                errors.client_phone ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.client_phone && (
              <p className="text-xs text-red-600 mt-1">{errors.client_phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('form.serviceLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            {...register('service_type')}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.service_type ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <option value="">{t('form.servicePlaceholder')}</option>
            <option value="web">{t('form.serviceOptions.web')}</option>
            <option value="ecommerce">{t('form.serviceOptions.ecommerce')}</option>
            <option value="custom_erp">{t('form.serviceOptions.custom_erp')}</option>
            <option value="custom_crm">{t('form.serviceOptions.custom_crm')}</option>
            <option value="custom_pos">{t('form.serviceOptions.custom_pos')}</option>
            <option value="automation">{t('form.serviceOptions.automation')}</option>
            <option value="maintenance">{t('form.serviceOptions.maintenance')}</option>
          </select>
          {errors.service_type && (
            <p className="text-xs text-red-600 mt-1">{errors.service_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('form.budgetLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            {...register('budget_range')}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.budget_range ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <option value="">{t('form.budgetPlaceholder')}</option>
            <option value="tier1">{t('form.budgetOptions.tier1')}</option>
            <option value="tier2">{t('form.budgetOptions.tier2')}</option>
            <option value="tier3">{t('form.budgetOptions.tier3')}</option>
            <option value="tier4">{t('form.budgetOptions.tier4')}</option>
          </select>
          {errors.budget_range && (
            <p className="text-xs text-red-600 mt-1">{errors.budget_range.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('form.descLabel')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder={t('form.descPlaceholder')}
            {...register('description')}
            disabled={isPending}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.description ? 'border-red-400 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('form.submittingButton')}</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{t('form.submitButton')}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>{t('form.securityNotice')}</span>
        </div>
      </form>
    </div>
  );
}
