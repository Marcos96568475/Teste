import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acompanhamento de estudos | PMPE + PCPE",
  description: "Painel de estudos integrado para os concursos da PMPE e PCPE.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
