import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'
import { handleGoogleRedirect } from './lib/googleAuth'

handleGoogleRedirect();

// Error tracking — no-ops until VITE_SENTRY_DSN is set in Vercel.
const sentryDsn = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.1,
    environment: (import.meta as any).env?.MODE || 'production',
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
