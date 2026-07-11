// POST /api/auth/reset-password/confirm  { email, code, password }
// Verifies the emailed code and sets a new password.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { email, code, password } = await request.json();
  if (!email || !code || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const { prisma } = await import("@/lib/prisma");

  const otp = await prisma.loginOtp.findFirst({
    where: { email: normalized, code: String(code).trim() },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email: normalized }, data: { password: hashed } });
  await prisma.loginOtp.deleteMany({ where: { email: normalized } });

  return NextResponse.json({ ok: true });
}
