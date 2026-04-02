import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollProgress } from "@/components/scroll-progress";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scholarlink Online Tutors | Global Digital Prospectus",
  description: "Shaping Responsible, Globally-Minded Future Leaders. Expert online tutoring for GCC, UK, and Canada. Academic Tutoring & Skill Development.",
  keywords: ["online tutoring", "education", "academic support", "IELTS", "mathematics", "science"],
  authors: [{ name: "Scholarlink" }],
  openGraph: {
    title: "Scholarlink Online Tutors",
    description: "Expert online tutoring with a 95% graduation rate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-main antialiased selection:bg-accent/20 selection:text-primary`}>
        <ThemeProvider>
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
