import { Resend } from "resend";

const PRIMARY_FROM = "MyJantes <contact@apps.myjantes.fr>";
const FALLBACK_FROM = "MyJantes <contact@myjantes.mytoolsgroup.eu>";

async function getCredentials(): Promise<{ apiKey: string; fromEmail: string }> {
  if (process.env.RESEND_API_KEY) {
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || PRIMARY_FROM,
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Resend not configured: set RESEND_API_KEY or connect via Replit integration");
  }

  const connectionSettings = await fetch(
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

  if (!connectionSettings?.settings?.api_key) {
    throw new Error("Resend not connected");
  }

  return {
    apiKey: connectionSettings.settings.api_key as string,
    fromEmail: (connectionSettings.settings.from_email as string) || PRIMARY_FROM,
  };
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return { client: new Resend(apiKey), fromEmail };
}

/**
 * Send an email with automatic fallback to the secondary domain if the primary fails.
 * Resend returns a 403/422 when the sending domain is not verified.
 */
async function sendWithFallback(
  client: Resend,
  primaryFrom: string,
  payload: Omit<Parameters<Resend["emails"]["send"]>[0], "from">
): Promise<void> {
  const tryFrom = async (from: string) => {
    const { error } = await client.emails.send({ from, ...payload });
    return error;
  };

  let error = await tryFrom(primaryFrom);

  if (error) {
    const isDomainError =
      String(error.name).toLowerCase().includes("domain") ||
      String((error as any).statusCode) === "403" ||
      String((error as any).statusCode) === "422" ||
      String(error.message).toLowerCase().includes("domain") ||
      String(error.message).toLowerCase().includes("not verified") ||
      String(error.message).toLowerCase().includes("sender");

    if (isDomainError && primaryFrom !== FALLBACK_FROM) {
      console.warn(`[email] Primary sender failed (${error.message}), retrying with fallback…`);
      error = await tryFrom(FALLBACK_FROM);
    }

    if (error) throw new Error(`Resend error: ${error.message}`);
  }
}

export interface ContactEmailData {
  name: string;
  firstName?: string | null;
  email: string;
  phone?: string | null;
  vehicle?: string | null;
  message: string;
  service?: string | null;
  imageUrl?: string | null;
  adminEmail?: string;
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string, username: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const resetLink = `${process.env.SITE_URL || "https://appmyjantes.mytoolsgroup.eu"}/admin?reset=${resetToken}`;
    const html = `
<!DOCTYPE html><html><head><meta charset="utf-8" />
<style>body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}.container{max-width:500px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#111;padding:28px 36px;text-align:center}.header h1{color:#fff;font-size:20px;font-weight:900;margin:0}.badge{display:inline-block;background:#dc2626;color:#fff;font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;text-transform:uppercase;letter-spacing:1px;margin-top:10px}.body{padding:32px 36px}.cta{display:inline-block;margin-top:20px;background:#dc2626;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:8px;text-decoration:none}.footer{background:#f9fafb;padding:16px 36px;text-align:center}.footer p{font-size:12px;color:#9ca3af;margin:2px 0}</style>
</head><body><div class="container">
<div class="header"><h1>MyJantes</h1><div class="badge">Réinitialisation du mot de passe</div></div>
<div class="body">
<p style="color:#374151;font-size:15px">Bonjour <strong>${username}</strong>,</p>
<p style="color:#6b7280;font-size:14px;line-height:1.6">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expirera dans 1 heure.</p>
<div style="text-align:center"><a href="${resetLink}" class="cta">Réinitialiser mon mot de passe</a></div>
<p style="color:#9ca3af;font-size:12px;margin-top:24px">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
</div>
<div class="footer"><p>MyJantes · 46 rue de la Convention, 62800 Liévin</p></div>
</div></body></html>`;
    await sendWithFallback(client, fromEmail, {
      to: toEmail,
      subject: "Réinitialisation de votre mot de passe — MyJantes",
      html,
    });
    console.log(`[email] Reset password sent to ${toEmail}`);
  } catch (error) {
    console.error("[email] Erreur envoi reset password:", error);
  }
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const fullName = [data.firstName, data.name].filter(Boolean).join(" ");
    const subject = `Nouvelle demande — ${fullName}`;

    const siteBase = process.env.SITE_URL || "https://appmyjantes.mytoolsgroup.eu";
    const imageHtml = data.imageUrl
      ? (() => {
          const absoluteUrl = data.imageUrl.startsWith("http")
            ? data.imageUrl
            : `${siteBase}${data.imageUrl}`;
          return `<hr class="divider" /><div class="field"><div class="label">Photo des jantes</div><div style="margin-top:8px;"><a href="${absoluteUrl}" target="_blank"><img src="${absoluteUrl}" alt="Photo jantes" style="max-width:100%;max-height:300px;border-radius:8px;border:1px solid #e5e7eb;display:block;" /></a><p style="font-size:11px;color:#9ca3af;margin-top:6px;"><a href="${absoluteUrl}" style="color:#dc2626;">Voir en taille réelle</a></p></div></div>`;
        })()
      : "";

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
        <div class="label">Nom complet</div>
        <div class="value">${fullName}</div>
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
      ${imageHtml}
      <div style="text-align:center;">
        <a href="mailto:${data.email}?subject=Re: Votre demande MyJantes" class="cta">Répondre à ${fullName}</a>
      </div>
    </div>
    <div class="footer">
      <p>Notification automatique — Formulaire de contact MyJantes</p>
      <p>MyJantes · 46 rue de la Convention, 62800 Liévin</p>
    </div>
  </div>
</body>
</html>`;

    const adminEmail = data.adminEmail || "contact@myjantes.com";

    await sendWithFallback(client, fromEmail, {
      to: adminEmail,
      bcc: ["rbelmahi90@gmail.com"],
      replyTo: data.email,
      subject,
      html,
    });

    console.log(`[email] Notification envoyée pour ${data.name} (${data.email})`);
  } catch (error) {
    console.error("[email] Erreur envoi notification:", error);
  }
}

export async function sendClientConfirmation(toEmail: string, _firstName?: string | null): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #111; padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 22px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .badge { display: inline-block; background: #dc2626; color: #fff; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
    .body { padding: 36px 40px; color: #374151; font-size: 15px; line-height: 1.7; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MyJantes</h1>
      <div class="badge">Confirmation de demande</div>
    </div>
    <div class="body">
      <p>Bonjour,</p>
      <p>Nous vous confirmons la bonne réception de votre demande de devis.</p>
      <p>Notre équipe va étudier votre demande et revenir vers vous dans les plus brefs délais avec une réponse adaptée.</p>
      <p>Si vous avez joint des photos, celles-ci sont bien en cours d'analyse par notre atelier.</p>
      <p>Pour toute information complémentaire, n'hésitez pas à nous contacter par téléphone au <a href="tel:+33321408053" style="color:#dc2626;font-weight:700">03 21 40 80 53</a> ou via notre formulaire de contact.</p>
      <p>Merci pour votre confiance.</p>
      <p>Cordialement,<br /><strong>L'équipe MY JANTES</strong></p>
    </div>
    <div class="footer">
      <p>MyJantes · 46 rue de la Convention, 62800 Liévin</p>
      <p>Lun–Ven 9h–12h30 / 13h30–18h · <a href="tel:+33321408053" style="color:#9ca3af">03 21 40 80 53</a></p>
    </div>
  </div>
</body>
</html>`;

    await sendWithFallback(client, fromEmail, {
      to: toEmail,
      replyTo: fromEmail,
      subject: "Confirmation de réception de votre demande de devis - MyJantes",
      html,
    });

    console.log(`[email] Confirmation client envoyée à ${toEmail}`);
  } catch (error) {
    console.error("[email] Erreur envoi confirmation client:", error);
  }
}
