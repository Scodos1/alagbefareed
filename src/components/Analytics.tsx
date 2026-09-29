import { useEffect } from 'react';

// Privacy-friendly analytics (Umami Cloud). No cookies, no consent banner
// needed. No-ops locally until VITE_UMAMI_WEBSITE_ID is set in Vercel.
export default function Analytics() {
  useEffect(() => {
    const websiteId = (import.meta as any).env?.VITE_UMAMI_WEBSITE_ID as string | undefined;
    if (!websiteId) return;
    if (document.querySelector('script[data-website-id]')) return;
    const src =
      ((import.meta as any).env?.VITE_UMAMI_SRC as string | undefined) ||
      'https://cloud.umami.is/script.js';
    const s = document.createElement('script');
    s.defer = true;
    s.src = src;
    s.setAttribute('data-website-id', websiteId);
    document.head.appendChild(s);
  }, []);
  return null;
}
