import nodemailer from "nodemailer";

/**
 * Sends a plain-text notification email to NOTIFY_EMAIL.
 * No-ops silently if SMTP_HOST or NOTIFY_EMAIL are not set, so the route
 * works without email configured.
 *
 * Required env vars: SMTP_HOST, NOTIFY_EMAIL
 * Optional env vars: SMTP_PORT (default 587), SMTP_USER, SMTP_PASS
 */
export async function sendNotification(subject: string, text: string): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: NOTIFY_EMAIL,
    subject,
    text,
  });
}
