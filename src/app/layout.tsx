import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Mobatos | Gestión Inteligente de Medidores',
  description: 'Sistema integral para el enrutamiento y gestión de medidores. Optimizando operaciones de campo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
