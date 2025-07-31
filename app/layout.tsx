import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ImageProvider } from "./context/ImageContext";
import Header from "./components/Header";

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Status Armazém",
  description: "Visão geral de estoques e programação de embarques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased`}
      >
        <ImageProvider>
          <Header />
          {children}
        </ImageProvider>
      </body>
    </html>
  );
}
