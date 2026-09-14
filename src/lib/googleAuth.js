import supabase from './supabase';

let googleInitialized = false;

function ensureGoogleInit() {
  if (googleInitialized) return;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId || typeof window.google === 'undefined') return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  googleInitialized = true;
}

async function handleCredentialResponse(response) {
  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  });
  if (error) {
    console.error('[google-auth] signInWithIdToken failed:', error.message);
  }
}

export function renderGoogleButton(container) {
  ensureGoogleInit();
  if (!container || typeof window.google === 'undefined') return;
  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    width: container.offsetWidth || 300,
    text: 'continue_with',
    shape: 'rectangular',
  });
}

export function signInWithGoogle() {
  ensureGoogleInit();
  if (typeof window.google === 'undefined') {
    console.warn('[google-auth] Google Identity Services not loaded');
    return;
  }
  window.google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Fallback: open popup
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = window.location.origin;
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&prompt=select_account&nonce=${crypto.randomUUID()}`;
      const popup = window.open(url, 'google-auth', 'width=500,height=600');
      const handler = (event) => {
        if (event.data?.type !== 'google-auth-success') return;
        window.removeEventListener('message', handler);
        if (event.data.id_token) {
          supabase.auth.signInWithIdToken({ provider: 'google', token: event.data.id_token });
        }
      };
      window.addEventListener('message', handler);
    }
  });
}

export async function handleGoogleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('id_token');
  if (!token) return;
  window.history.replaceState({}, '', window.location.pathname);
  const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token });
  if (error) console.error('[google-auth] signInWithIdToken failed:', error.message);
}
