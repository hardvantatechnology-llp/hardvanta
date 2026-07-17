import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Fixed dummy hash used to keep authorize()'s response time constant whether
// or not the account exists — prevents timing-based email enumeration.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8n7t3T8n3Xs.3XkgKq7YbFvMRRZLXK";

export async function getAuthOptions() {
  const { prisma } = await import("@/lib/prisma");

  return {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // 12h — shorter-lived than the 30-day default
    pages: {
      signIn: "/login",
    },

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          otp: { label: "OTP", type: "text" },
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials?.password || !credentials?.otp) {
            return null;
          }
          const email = credentials.email.toLowerCase().trim();

          // Rate limit login attempts per-email and per-IP to slow down
          // password/OTP guessing against this callback.
          const ip = getClientIp(req);
          const byEmail = checkRateLimit(`authorize:email:${email}`, { limit: 10, windowMs: 15 * 60 * 1000 });
          const byIp = checkRateLimit(`authorize:ip:${ip}`, { limit: 30, windowMs: 15 * 60 * 1000 });
          if (!byEmail.allowed || !byIp.allowed) return null;

          const user = await prisma.user.findUnique({ where: { email } });

          // Always run a bcrypt comparison, even for unknown/passwordless
          // accounts, so response time doesn't leak whether the email exists.
          const hashToCheck = user?.password || DUMMY_HASH;
          const valid = await bcrypt.compare(credentials.password, hashToCheck);
          if (!user || !user.password || !valid) return null;

          const otp = await prisma.loginOtp.findFirst({
            where: { email, code: credentials.otp.trim(), purpose: "LOGIN" },
            orderBy: { createdAt: "desc" },
          });
          if (!otp || otp.expires < new Date()) return null;

          await prisma.loginOtp.deleteMany({ where: { email, purpose: "LOGIN" } });

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        },
      }),
    ],

    callbacks: {
      
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.role = user.role ?? "USER";
        }

        // Google OAuth: pehli baar login pe DB se user fetch karo
        if (account?.provider === "google" && token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role ?? "USER";
          }
        }

        return token;
      },

      async session({ session, token }) {
        if (session.user) {
session.user.id = token.id;
session.user.role = token.role;        }
        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
  };
}