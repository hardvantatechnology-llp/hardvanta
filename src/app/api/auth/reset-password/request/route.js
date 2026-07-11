// POST /api/auth/reset-password/request  { email }
// Emails a 6-digit reset code (reuses the LoginOtp table). Always returns a
// generic success so we don't reveal which emails have accounts.
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const normalized = email.toLowerCase().trim();

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Only send a code if the account exists and uses a password.
  if (user?.password) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.loginOtp.deleteMany({ where: { email: normalized } });
    await prisma.loginOtp.create({ data: { email: normalized, code, expires } });

    const result = await sendPasswordResetEmail(normalized, code);
    const demo = !result.sent && !process.env.RESEND_API_KEY;
    return NextResponse.json({ ok: true, demo, ...(demo ? { devCode: code } : {}) });
  }

  // Same response shape whether or not the account exists.
  return NextResponse.json({ ok: true, demo: false });
}
