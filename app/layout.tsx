import type { Metadata } from "next";
import { inter, sora } from "@/app/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Virada IA",
  description:
    "Análise personalizada de hábitos, rotina e direção para descobrir o que mudar primeiro.",
  applicationName: "Virada IA",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
