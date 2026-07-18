// Email sending via Resend.
//
// Setup: create an account at resend.com, add an API key, and set:
//   RESEND_API_KEY=...           (your Resend API key)
//   EMAIL_FROM="hardvanta <onboarding@resend.dev>"   (verified sender)
//
// Until RESEND_API_KEY is set, emails are logged to the server console instead
// of being sent — so OTP login still works in local development (read the code
// from the terminal).
import { Resend } from "resend";
import { formatPrice } from "@/utils/formatPrice";

const FROM = process.env.EMAIL_FROM || "hardvanta <onboarding@resend.dev>";

function getClient() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

async function send({ to, subject, html }) {
  const client = getClient();
  if (!client) {
    // Dev fallback: no API key configured.
    console.log(`\n[email] (not sent — RESEND_API_KEY missing)\n  to: ${to}\n  subject: ${subject}\n`);
    return { sent: false };
  }
  try {
    await client.emails.send({ from: FROM, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("[email] send failed:", err?.message || err);
    return { sent: false, error: err?.message };
  }
}

export async function sendOtpEmail(to, code) {
  // Always log in dev so OTP login is testable without a configured sender.
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[email] OTP for ${to}: ${code}\n`);
  }
  return send({
    to,
    subject: `${code} is your hardvanta login code`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0a1f44">Your login code</h2>
        <p style="color:#444">Use this code to finish signing in to hardvanta. It expires in 10 minutes.</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e4fd8">${code}</p>
        <p style="color:#888;font-size:12px">If you didn't try to log in, you can ignore this email.</p>
      </div>`,
  });
}

export async function sendPasswordResetEmail(to, code) {
  // Always log in dev so reset is testable without a configured sender.
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[email] Password reset code for ${to}: ${code}\n`);
  }
  return send({
    to,
    subject: `${code} is your hardvanta password reset code`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0a1f44">Reset your password</h2>
        <p style="color:#444">Use this code to reset your hardvanta password. It expires in 10 minutes.</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e4fd8">${code}</p>
        <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  });
}

// Notifies the admin/sales inbox of a new enquiry from one of the bulk-order
// forms (B2B / Bulk Orders, Bulk Enquiry, ATL Kits Enquiry). Best-effort: the
// caller should never let a failure here roll back the already-saved enquiry.
export async function sendEnquiryAdminNotification({
  formType,
  id,
  name,
  company,
  email,
  phone,
  product,
  quantity,
  message,
}) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) {
    console.log(
      `\n[email] (not sent — ADMIN_NOTIFICATION_EMAIL missing)\n  new ${formType} enquiry ${id ? `#${id}` : ""} from ${name} <${email}>\n`
    );
    return { sent: false };
  }

  const row = (label, value) =>
    value
      ? `<tr><td style="padding:6px 10px;color:#888;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 10px;color:#0a1f44;font-size:14px">${value}</td></tr>`
      : "";

  return send({
    to,
    subject: `New ${formType} enquiry from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#0a1f44">New ${formType} enquiry</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          ${row("Name", name)}
          ${row("Company / Institution", company)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Product", product)}
          ${row("Quantity", quantity)}
          ${row("Message", message)}
          ${row("Date &amp; Time", new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }))}
        </table>
        <p style="color:#888;font-size:12px">Reply directly to this email, or open the enquiry in the admin dashboard, to follow up.</p>
      </div>`,
  });
}

// Confirms receipt to the customer who submitted an enquiry.
export async function sendEnquiryConfirmationEmail({ to, name, formType }) {
  return send({
    to,
    subject: `We've received your ${formType} enquiry — hardvanta`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0a1f44">Thank you, ${name || "there"}!</h2>
        <p style="color:#444">We've received your ${formType} enquiry. Our team will get back to you within 24–48 hours with pricing and availability.</p>
        <p style="color:#888;font-size:12px">If you have urgent requirements, feel free to reply to this email.</p>
      </div>`,
  });
}

export async function sendOrderConfirmationEmail(to, order) {
  const rows = (order.items || [])
    .map(
      (it) =>
        `<tr><td style="padding:6px 0;color:#444">${it.productName ?? it.name} × ${it.quantity}</td>
         <td style="padding:6px 0;text-align:right;color:#0a1f44">${formatPrice(it.price * it.quantity)}</td></tr>`
    )
    .join("");

  return send({
    to,
    subject: `Order confirmed — #${order.id.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0a1f44">Thank you for your order! 🎉</h2>
        <p style="color:#444">Your order <strong>#${order.id.slice(-8).toUpperCase()}</strong> has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          ${rows}
          <tr><td style="padding:10px 0;border-top:1px solid #eee;font-weight:bold;color:#0a1f44">Total</td>
          <td style="padding:10px 0;border-top:1px solid #eee;text-align:right;font-weight:bold;color:#0a1f44">${formatPrice(order.total)}</td></tr>
        </table>
        <p style="color:#444">Payment: ${order.paymentMethod === "ONLINE" ? "Paid online" : "Cash on Delivery"}</p>
        <p style="color:#888;font-size:12px">You can track your order anytime under "My Orders" on hardvanta.</p>
      </div>`,
  });
}
