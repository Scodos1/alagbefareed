// Shared admin allowlist — mirrors the backend ADMIN_EMAILS check.
// Only these emails may see or enter /admin.
const FALLBACK_OWNER_EMAIL = 'alagbefareed@gmail.com';

export function adminEmails(): string[] {
  const raw = (import.meta as any).env?.VITE_ADMIN_EMAILS || FALLBACK_OWNER_EMAIL;
  return String(raw)
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
