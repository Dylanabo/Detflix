// N'accepte que des chemins internes ("/films"), jamais "//evil.com" ni "https://...",
// pour éviter les redirections ouvertes via ?callbackUrl=.
export function safeCallbackUrl(value) {
    if (typeof value !== 'string') return '/';
    try {
        const url = new URL(value, 'http://detflix.local');
        if (url.origin !== 'http://detflix.local') return '/';
        return url.pathname + url.search + url.hash;
    } catch {
        return '/';
    }
}
