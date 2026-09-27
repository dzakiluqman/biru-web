'use server';

import { ticketSubmissionSchema, TicketSubmissionInput, TicketStatus } from '@/types/ticket';
import { insertTicket, updateTicketStatusAndNotes } from '@/utils/supabase/tickets';
import { revalidatePath } from 'next/cache';

export async function submitTicketAction(input: TicketSubmissionInput) {
  const parseResult = ticketSubmissionSchema.safeParse(input);
  if (!parseResult.success) {
    const errorMsg =
      (parseResult.error as any).issues?.map((e: any) => e.message).join(', ') ||
      'Format data tiket tidak valid.';
    return {
      success: false,
      error: errorMsg,
    };
  }

  const result = await insertTicket(parseResult.data);
  if (!result.success || !result.ticket) {
    return {
      success: false,
      error: result.error || 'Terjadi kesalahan sistem saat membuat tiket.',
    };
  }

  revalidatePath('/admin/dashboard');
  return {
    success: true,
    ticket_code: result.ticket.ticket_code,
    ticket: result.ticket,
  };
}

export async function updateTicketAction(
  id: string,
  status: TicketStatus,
  adminNotes?: string | null
) {
  const result = await updateTicketStatusAndNotes(id, status, adminNotes);
  if (!result.success) {
    return {
      success: false,
      error: result.error || 'Gagal memperbarui status tiket.',
    };
  }

  revalidatePath('/admin/dashboard');
  return {
    success: true,
    ticket: result.ticket,
  };
}
