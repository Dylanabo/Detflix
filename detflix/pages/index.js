import Head from 'next/head';
import { Inter } from 'next/font/google';
import { signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ user }) {
    return (
        <>
            <Head>
                <title>Detflix</title>
            </Head>
            <main className={`flex min-h-screen flex-col items-center justify-center gap-4 p-24 ${inter.className}`}>
                <h1 className="text-4xl font-bold">Detflix</h1>
                <p>Bienvenue, {user.email} !</p>
                <p>Detflix est un clone de Netflix construit avec Next.js et PostgreSQL. Projet en cours.</p>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="rounded bg-[#e50914] px-4 py-2 text-white hover:bg-[#b70710]"
                >
                    Se déconnecter
                </button>
            </main>
        </>
    );
}

// Vérification côté serveur (en plus de proxy.js) : aucune page protégée n'est rendue sans session.
export async function getServerSideProps({ req, res, resolvedUrl }) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return {
            redirect: {
                destination: `/login?callbackUrl=${encodeURIComponent(resolvedUrl)}`,
                permanent: false,
            },
        };
    }
    return { props: { user: { id: session.user.id, email: session.user.email } } };
}
