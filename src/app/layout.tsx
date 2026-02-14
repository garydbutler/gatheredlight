import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GatheredLight - Where Memories Find Their Way Home',
  description: 'A memorial tribute platform where loved ones gather to share stories, photos, and cherished memories.',
  openGraph: {
    title: 'GatheredLight',
    description: 'Where memories find their way home.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen texture-paper">
        {children}
      </body>
    </html>
  );
}
