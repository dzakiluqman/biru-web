import { Resend } from 'resend';
import { Ticket } from '@/types/ticket';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendTicketNotifications(ticket: Ticket): Promise<{ success: boolean; error?: string }> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'biru Agency <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'support@biru.agency';

  if (!resend) {
    console.info('[Email Notification Mock] RESEND_API_KEY not configured. Notification simulated for ticket:', {
      ticket_code: ticket.ticket_code,
      client_email: ticket.client_email,
      service: ticket.service_type,
    });
    return { success: true };
  }

  try {
    // 1. Send confirmation to client
    await resend.emails.send({
      from: fromEmail,
      to: ticket.client_email,
      subject: `[${ticket.ticket_code}] Tiket Proyek Anda Telah Diterima - biru Digital Agency`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 24px; border-radius: 8px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">biru<span style="color: #38bdf8;">.</span></h1>
            <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Digital Engineering & Business Automation</p>
          </div>
          
          <div style="background-color: white; padding: 28px; border-radius: 8px; margin-top: 16px; border: 1px solid #e2e8f0;">
            <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Halo ${ticket.client_name},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Terima kasih telah mengajukan kebutuhan proyek kepada tim <strong>biru</strong>. Tiket Anda telah resmi diterbitkan dalam sistem arsitektur kami.
            </p>

            <div style="background-color: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 12px; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 1px;">Nomor Tiket Resmi</span>
              <div style="font-size: 26px; font-weight: 800; color: #1e40af; margin-top: 4px; letter-spacing: 1px;">${ticket.ticket_code}</div>
            </div>

            <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px;">Rincian Kebutuhan:</h3>
            <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; width: 140px;">Layanan:</td>
                <td style="padding: 6px 0;">${ticket.service_type}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600;">Estimasi Budget:</td>
                <td style="padding: 6px 0;">${ticket.budget_range}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600;">WhatsApp:</td>
                <td style="padding: 6px 0;">${ticket.client_phone}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 6px; font-size: 13px; color: #475569;">
              <strong>Langkah Selanjutnya:</strong>
              <ol style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                <li>Senior Solution Architect kami akan mengaudit spesifikasi ini dalam waktu &lt; 2 jam.</li>
                <li>Kami akan menghubungi Anda via WhatsApp atau email untuk konfirmasi jadwal discovery session.</li>
              </ol>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} biru Digital Agency. All rights reserved.
          </div>
        </div>
      `,
    });

    // 2. Alert agency admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[ALERT BARU] Tiket ${ticket.ticket_code} dari ${ticket.client_name} (${ticket.service_type})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2>Tiket Proyek Masuk: ${ticket.ticket_code}</h2>
          <p><strong>Klien:</strong> ${ticket.client_name} (${ticket.client_email} / ${ticket.client_phone})</p>
          <p><strong>Layanan:</strong> ${ticket.service_type}</p>
          <p><strong>Estimasi Budget:</strong> ${ticket.budget_range}</p>
          <p><strong>Deskripsi:</strong></p>
          <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px;">${ticket.description}</div>
        </div>
      `,
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Email Notification Error]', err);
    return { success: false, error: err.message };
  }
}
