// NextAuth configuration — email/password (Credentials) + Google OAuth.
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

export async function getAuthOptions() {
  const { prisma } = await import("@/lib/prisma");
    
  console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

  return {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
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
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password || !credentials?.otp) {
            return null;
          }
          const email = credentials.email.toLowerCase().trim();

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;

          // Second factor: verify the latest, unexpired OTP for this email.
          const otp = await prisma.loginOtp.findFirst({
            where: { email, code: credentials.otp.trim() },
            orderBy: { createdAt: "desc" },
          });
          if (!otp || otp.expires < new Date()) return null;

          // One-time use: clear all codes for this email after a successful login.
          await prisma.loginOtp.deleteMany({ where: { email } });

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role ?? "USER";
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}
