import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Fliegercamp - Flugplatz Buchungsplattform',
  description:
    'Portal zur Organisation von Fliegerlager für Segelflieger. Finde und buche Flugplätze für dein nächstes Fluglager.',
  keywords: [
    'Fliegercamp',
    'Fluglager',
    'Segelflug',
    'Flugplatz',
    'Buchung',
    'Segelflugverein',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={poppins.variable}>
      <body className="min-h-screen bg-neutral-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
