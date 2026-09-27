import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'biru | Digital Engineering & Business Automation Agency',
  description: 'Enterprise website development, custom ERP/CRM/POS systems, and business automation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="light scroll-smooth">
      <body className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
