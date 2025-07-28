import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ImageProvider } from "./context/ImageContext";
import ImageVersionFilter from "./components/ImageVersionFilter";
import Link from "next/link";

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
          <header className="bg-green-800 text-white shadow-sm sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-white">
                Status Armazem
              </Link>
              <ImageVersionFilter />
            </nav>
          </header>
          {children}
        </ImageProvider>
      </body>
    </html>
  );
}
