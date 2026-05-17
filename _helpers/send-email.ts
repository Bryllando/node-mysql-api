import nodemailer from 'nodemailer';
import config from '../config.json';
import { Resend } from 'resend';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || config.emailFrom }: any) {
    const hasResend = !!process.env.RESEND_API_KEY;

    if (hasResend) {
        return await sendWithResend({ to, subject, html, from });
    }

    const smtpOptions = {
        host: process.env.SMTP_HOST || config.smtpOptions.host,
        port: Number(process.env.SMTP_PORT) || config.smtpOptions.port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || config.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || config.smtpOptions.auth.pass
        }
    };
    const transporter = nodemailer.createTransport(smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}

async function sendWithResend({ to, subject, html, from }: any) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from,
        to,
        subject,
        html
    });
}