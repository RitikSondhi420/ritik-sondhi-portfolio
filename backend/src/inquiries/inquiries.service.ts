import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);
  private readonly recipientEmail = 'sondhiritik666@gmail.com';

  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; email: string; company?: string; message: string }) {
    this.logger.log(`📥 Inbound contact transmission from ${data.name} (${data.email}) intended for ${this.recipientEmail}`);

    let inquiryId: string | null = null;

    // 1. Persist inquiry in PostgreSQL via Prisma if available
    try {
      const inquiry = await this.prisma.inquiry.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company || null,
          message: data.message,
        },
      });
      inquiryId = inquiry.id;
    } catch (err: any) {
      this.logger.warn(`Could not save inquiry to database (${err?.message || err}).`);
    }

    // 2. Dispatch real email via Nodemailer if SMTP credentials are configured
    let emailSent = false;
    let emailError: string | null = null;

    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.SMTP_SERVICE || 'gmail',
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailSubject = `🚀 [Portfolio Inquiry] Transmission from ${data.name}${data.company ? ` (${data.company})` : ''}`;
        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b101d; color: #f8fafc; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0d9488, #7c3aed); padding: 24px 28px;">
              <h2 style="margin: 0; color: #ffffff; font-size: 20px;">🚀 New Portfolio Transmission</h2>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Inbound inquiry from your online portfolio desk</p>
            </div>
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 100px;">SENDER:</td>
                  <td style="padding: 8px 0; color: #f8fafc; font-weight: 600; font-size: 15px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">EMAIL:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #2dd4bf; text-decoration: none;">${data.email}</a></td>
                </tr>
                ${data.company ? `
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">COMPANY:</td>
                  <td style="padding: 8px 0; color: #cbd5e1;">${data.company}</td>
                </tr>` : ''}
              </table>
              <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #2dd4bf; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
              </div>
              <div style="text-align: center;">
                <a href="mailto:${data.email}?subject=Re: Your inquiry on Ritik Sondhi's Portfolio" style="display: inline-block; background: #0d9488; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 9999px; font-weight: 600; font-size: 14px;">Reply directly to ${data.name}</a>
              </div>
            </div>
            <div style="background: #070b14; padding: 14px 28px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
              Dispatched directly to ${this.recipientEmail} via Ritik Sondhi Portfolio Inquiries Desk
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Ritik Portfolio Desk" <${smtpUser}>`,
          replyTo: data.email,
          to: this.recipientEmail,
          subject: mailSubject,
          html: htmlContent,
          text: `From: ${data.name} (${data.email})\nCompany: ${data.company || 'N/A'}\n\nMessage:\n${data.message}`,
        });

        emailSent = true;
        this.logger.log(`✓ Email successfully transmitted to ${this.recipientEmail}`);
      } catch (err: any) {
        emailError = err?.message || String(err);
        this.logger.warn(`Failed to dispatch email via Nodemailer (${emailError})`);
      }
    } else {
      this.logger.log(
        `ℹ No SMTP credentials found in .env (SMTP_USER/SMTP_PASS). To enable direct Gmail delivery, set SMTP_USER="${this.recipientEmail}" and SMTP_PASS="<your-16-char-gmail-app-password>" in backend/.env`,
      );
    }

    // Build prefilled mailto URL for seamless direct client fallback
    const mailtoSubject = encodeURIComponent(`Portfolio Inquiry from ${data.name}${data.company ? ` (${data.company})` : ''}`);
    const mailtoBody = encodeURIComponent(`Hi Ritik,\n\n${data.message}\n\nBest regards,\n${data.name}\nEmail: ${data.email}\n${data.company ? `Company: ${data.company}` : ''}`);
    const mailtoUrl = `mailto:${this.recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    return {
      success: true,
      inquiryId,
      emailSent,
      recipient: this.recipientEmail,
      mailtoUrl,
      needsSmtpConfig: !smtpUser || !smtpPass,
    };
  }

  async findAll() {
    try {
      return await this.prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }
}
