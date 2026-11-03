import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyCredentials } from '@/lib/users';

export const authOptions = {
    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    pages: { signIn: '/login' },
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Adresse e-mail', type: 'email' },
                password: { label: 'Mot de passe', type: 'password' },
            },
            authorize: (credentials) =>
                verifyCredentials(credentials?.email, credentials?.password),
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.uid = user.id;
            return token;
        },
        session({ session, token }) {
            if (session.user) session.user.id = token.uid;
            return session;
        },
    },
};

export default NextAuth(authOptions);
