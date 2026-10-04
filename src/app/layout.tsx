import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { FloatingWhatsappChat } from "@/components/floating-whatsapp-chat";
import { Navbar } from "@/components/navbar";
import { siteUrl, siteSchema } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qusqueando Travel | Experiencias culturales en Perú",
    template: "%s | Qusqueando Travel",
  },
  description:
    "Agencia de turismo especializada en experiencias culturales, arqueoastronómicas y de naturaleza en Perú.",
  openGraph: {
    title: "Qusqueando Travel",
    description:
      "Experiencias culturales, arqueoastronómicas y de naturaleza en Perú.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-[#101828]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema).replace(/</g, "\\u003c") }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsappChat />
      </body>
    </html>
  );
}
