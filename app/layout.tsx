import type { Metadata } from "next";
import Script from "next/script";
import { inter, sora } from "@/app/fonts";
import { PwaBoot } from "@/components/PwaBoot";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Virada IA | Assessor pessoal proativo",
  description:
    "Fale o que precisa fazer. A inteligencia artificial organiza agenda, tarefas, compromissos, lembretes e replaneja seu dia.",
  applicationName: "Virada IA",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <PwaBoot />
        {children}
        <Script
          id="vercel-web-analytics"
          src="/_vercel/insights/script.js"
          strategy="afterInteractive"
          data-sdkn="@vercel/analytics/next"
          data-sdkv="2.0.1"
        />
        <Script
          id="vercel-speed-insights"
          src="/_vercel/speed-insights/script.js"
          strategy="afterInteractive"
          data-sdkn="@vercel/speed-insights/next"
          data-sdkv="2.0.0"
        />
      </body>
    </html>
  );
}
