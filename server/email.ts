import nodemailer from "nodemailer";

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  attachments?: EmailAttachment[];
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("[email] SMTP not configured — skipping email send. Configure SMTP_HOST, SMTP_USER, SMTP_PASS in environment secrets.");
    return false;
  }

  const serviceLabels: Record<string, string> = {
    renovation: "Rénovation complète",
    peinture: "Peinture & Customisation",
    redressage: "Redressage",
    debosselage: "Débosselage PDR",
    autre: "Autre",
  };

  const serviceLabel = data.service ? (serviceLabels[data.service] || data.service) : "Non précisé";

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #DC2626; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Nouvelle demande de devis — MyJantes</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px; font-weight: bold;">Nom :</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Email :</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Téléphone :</td>
            <td style="padding: 8px 0;">${data.phone || "Non renseigné"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Service :</td>
            <td style="padding: 8px 0;">${serviceLabel}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #DC2626; border-radius: 4px;">
          <p style="color: #666; font-weight: bold; margin: 0 0 8px 0;">Message :</p>
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        ${data.attachments && data.attachments.length > 0 ? `<p style="color: #666; margin-top: 12px; font-size: 13px;">${data.attachments.length} photo(s) jointe(s) à ce message.</p>` : ""}
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          Reçu depuis myjantes.fr — MyJantes, 46 rue de la Convention, 62800 Liévin
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MyJantes Site" <${process.env.SMTP_USER}>`,
    to: "contact@myjantes.com",
    bcc: "rbelmahi90@gmail.com",
    replyTo: data.email,
    subject: `[MyJantes] Demande de devis — ${data.name} — ${serviceLabel}`,
    html: htmlBody,
    attachments: (data.attachments || []).map((att) => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[email] Email sent successfully to contact@myjantes.com`);
    return true;
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return false;
  }
}
