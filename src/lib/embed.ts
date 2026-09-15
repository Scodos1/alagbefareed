/** Slugs whose live sites allow iframe embedding (no X-Frame-Options / CSP frame-ancestors block). */
export const LIVE_EMBED_SLUGS: ReadonlySet<string> = new Set(['stylesbytiwa', 'cv-builder']);

/** Slugs that need auth/JS too heavy for card embed — detail page only. */
export const DETAIL_ONLY_EMBED: ReadonlySet<string> = new Set([]);

export function canEmbedLive(slug: string): boolean {
  return LIVE_EMBED_SLUGS.has(slug);
}

export function canEmbedInCard(slug: string): boolean {
  return LIVE_EMBED_SLUGS.has(slug) && !DETAIL_ONLY_EMBED.has(slug);
}
