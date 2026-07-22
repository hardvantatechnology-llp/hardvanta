import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PageTransition from "@/components/ui/PageTransition";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
const siteTitle = "hardvanta — Electronics & Robotics Store";
const siteDescription =
  "Shop Arduino, Raspberry Pi, sensors, motors, drone parts and DIY electronics. Fast delivery across India.";

export const metadata = {
  // Lets any relative image URL passed to a page's `metadata.openGraph.images`
  // (e.g. a product image served from /uploads or Supabase Storage) resolve
  // to an absolute URL — required for social-share previews to load the image.
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s | hardvanta",
  },

  description: siteDescription,

  keywords: [
    "Arduino India",
    "Raspberry Pi India",
    "electronic components online",
    "robotics parts India",
    "sensors and motors",
    "drone parts India",
    "DIY electronics store",
  ],

  authors: [{ name: "hardvanta" }],
  creator: "hardvanta",
  publisher: "hardvanta",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "hardvanta",
    locale: "en_IN",
    type: "website",
    images: ["/images/hardvanta.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/hardvanta.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  // verification: {
  //   google: "your-google-search-console-code-here",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-brand-silver to-brand-bg">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}