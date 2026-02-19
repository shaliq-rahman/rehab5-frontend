import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rehab5.com"),
  title: {
    default: "Rehab5 — Expert Physiotherapy & Rehabilitation",
    template: "%s | Rehab5",
  },
  description:
    "Rehab5 offers world-class physiotherapy, sports rehabilitation, and pain management in the comfort of a clinic that truly cares. Book your consultation online in seconds.",
  keywords: [
    "physiotherapy",
    "rehabilitation",
    "sports physio",
    "doctor consultation",
    "pain management",
    "rehab clinic",
    "online booking",
    "Rehab5",
    "neurological rehab",
    "pediatric physiotherapy",
  ],
  authors: [{ name: "Rehab5 Team" }],
  creator: "Rehab5",
  publisher: "Rehab5",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rehab5.com",
    siteName: "Rehab5",
    title: "Rehab5 — Expert Physiotherapy & Rehabilitation",
    description:
      "Book expert physiotherapy consultations online. 500+ patients, 98% success rate. Specialists in sports rehab, neuro rehab, pediatric physio & pain management.",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 600,
        alt: "Rehab5 — Expert Physiotherapy & Rehabilitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rehab5 — Expert Physiotherapy & Rehabilitation",
    description:
      "World-class physio & rehab care. Book online in seconds with Rehab5.",
    images: ["/assets/logo.png"],
    creator: "@rehab5",
  },
  icons: {
    icon: [
      { url: "/assets/logo.png", type: "image/png" },
    ],
    apple: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://rehab5.com",
  },
  category: "healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#24a3ac" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
