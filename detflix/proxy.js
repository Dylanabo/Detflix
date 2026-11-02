import { withAuth } from 'next-auth/middleware';

// Toutes les pages sont protégées par défaut, sauf celles exclues dans `matcher`.
export default withAuth({
    pages: { signIn: '/login' },
});

export const config = {
    matcher: [
        '/((?!api|login|register|_next/static|_next/image|favicon.ico|logo.png|banner.jpg).*)',
    ],
};
