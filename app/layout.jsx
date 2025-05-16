import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'YouTube Video Clipper',
  description: 'Download and clip YouTube videos easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='min-h-screen py-10 px-4'>
          <div className='max-w-5xl mx-auto'>{children}</div>
        </main>
      </body>
    </html>
  );
}
