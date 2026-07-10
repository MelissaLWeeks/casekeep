import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CaseKeep",
    template: "%s | CaseKeep",
  },
  description:
    "Keep every medical bill, claim, and document organized — without the stress.",
  applicationName: "CaseKeep",
  keywords: [
    "medical expense tracker",
    "medical bills",
    "insurance claims",
    "legal case documents",
    "case organization",
  ],
  authors: [{ name: "Weeks Systems" }],
  creator: "Weeks Systems",
  publisher: "Weeks Systems",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
