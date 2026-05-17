"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_json_1 = __importDefault(require("../config.json"));
const resend_1 = require("resend");
async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || config_json_1.default.emailFrom }) {
    const hasResend = !!process.env.RESEND_API_KEY;
    if (hasResend) {
        return await sendWithResend({ to, subject, html, from });
    }
    const smtpOptions = {
        host: process.env.SMTP_HOST || config_json_1.default.smtpOptions.host,
        port: Number(process.env.SMTP_PORT) || config_json_1.default.smtpOptions.port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || config_json_1.default.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || config_json_1.default.smtpOptions.auth.pass
        }
    };
    const transporter = nodemailer_1.default.createTransport(smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}
async function sendWithResend({ to, subject, html, from }) {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from,
        to,
        subject,
        html
    });
}
