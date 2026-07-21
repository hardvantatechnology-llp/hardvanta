import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

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

export const metadata = {
  metadataBase: new URL("https://hvkart.hardvantatechnologies.in"),

  title: {
    default: "hardvanta — Electronics & Robotics Store",
    template: "%s | hardvanta",
  },

  description:
    "Shop Arduino, Raspberry Pi, sensors, motors, drone parts and DIY electronics. Fast delivery across India.",

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
    canonical: "https://hvkart.hardvantatechnologies.in",
  },

  openGraph: {
    title: "hardvanta — Electronics & Robotics Store",
    description:
      "Shop Arduino, Raspberry Pi, sensors, motors, drone parts and DIY electronics. Fast delivery across India.",
    url: "https://hvkart.hardvantatechnologies.in",
    siteName: "hardvanta",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hardvanta.png",
        width: 1200,
        height: 630,
        alt: "hardvanta — Electronics & Robotics Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "hardvanta — Electronics & Robotics Store",
    description:
      "Shop Arduino, Raspberry Pi, sensors, motors, drone parts and DIY electronics.",
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
          <main className="min-h-screen bg-cloud">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}