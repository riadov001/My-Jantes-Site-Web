import { Resend } from "resend";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error("X-Replit-Token not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error("Resend not connected");
  }

  return {
    apiKey: connectionSettings.settings.api_key as string,
    fromEmail: (connectionSettings.settings.from_email as string) || "MyJantes <noreply@myjantes.fr>",
  };
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return { client: new Resend(apiKey), fromEmail };
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  vehicle?: string | null;
  message: string;
  service?: string | null;
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const subject = `Nouvelle demande — ${data.name}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #111; padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 22px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .badge { display: inline-block; background: #dc2626; color: #fff; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
    .body { padding: 36px 40px; }
    .field { margin-bottom: 18px; }
    .label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; font-weight: 500; }
    .value a { color: #dc2626; text-decoration: none; }
    .message-box { background: #f9fafb; border-left: 4px solid #dc2626; border-radius: 4px; padding: 16px 20px; margin-top: 8px; font-size: 15px; color: #374151; line-height: 1.7; white-space: pre-wrap; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .cta { display: inline-block; margin-top: 24px; background: #dc2626; color: #fff !important; font-size: 14px; font-weight: 700; padding: 13px 30px; border-radius: 8px; text-decoration: none; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MyJantes</h1>
      <div class="badge">Nouvelle demande de contact</div>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nom</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      ${data.phone ? `<div class="field"><div class="label">Téléphone</div><div class="value"><a href="tel:${data.phone}">${data.phone}</a></div></div>` : ""}
      ${data.vehicle ? `<div class="field"><div class="label">Véhicule</div><div class="value">${data.vehicle}</div></div>` : ""}
      ${data.service ? `<div class="field"><div class="label">Service demandé</div><div class="value">${data.service}</div></div>` : ""}
      <hr class="divider" />
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
      <div style="text-align:center;">
        <a href="mailto:${data.email}?subject=Re: Votre demande MyJantes" class="cta">Répondre à ${data.name}</a>
      </div>
    </div>
    <div class="footer">
      <p>Notification automatique — Formulaire de contact MyJantes</p>
      <p>MyJantes · 46 rue de la Convention, 62800 Liévin</p>
    </div>
  </div>
</body>
</html>`;

    await client.emails.send({
      from: fromEmail,
      to: "contact@myjantes.com",
      bcc: "rbelmahi90@gmail.com",
      reply_to: data.email,
      subject,
      html,
    });

    console.log(`[email] Notification envoyée pour ${data.name} (${data.email})`);
  } catch (error) {
    console.error("[email] Erreur envoi notification:", error);
  }
}
