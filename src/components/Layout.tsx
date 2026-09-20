import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-[color:var(--color-fg)] focus:text-[color:var(--color-bg)] focus:text-sm"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
