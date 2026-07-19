// POST /api/account/change-password  { currentPassword, newPassword }
// Verifies the signed-in user's current password and sets a new one.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { getAuthOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // Rate limit current-password-guessing attempts per-user and per-IP.
  const ip = getClientIp(request);
  const byUser = checkRateLimit(`change-password:user:${userId}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  const byIp = checkRateLimit(`change-password:ip:${ip}`, { limit: 30, windowMs: 15 * 60 * 1000 });
  if (!byUser.allowed || !byIp.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.password) {
    return NextResponse.json(
      { error: "This account signs in with Google and has no password to change." },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  // Stamping passwordChangedAt invalidates any already-issued JWT session on
  // its next periodic re-check (see the jwt callback in src/lib/auth.js).
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, passwordChangedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
