// Disabled: this shim used to POST your project ref to a third-party URL
// (designarena.ai) whenever Supabase returned a 5xx. That is an unnecessary
// data leak and an extra failure point, so it is now a deliberate no-op.
// Kept (same export name) so existing imports keep working.
export function triggerRestore() {
  // no-op
}
