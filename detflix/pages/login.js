import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import AuthLayout from '@/components/AuthLayout';
import { authOptions } from './api/auth/[...nextauth]';
import { safeCallbackUrl } from '@/lib/redirect';
import styles from '@/styles/auth.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.ok) {
                await router.replace(safeCallbackUrl(router.query.callbackUrl));
                return;
            }
            // Message volontairement générique : on ne dit pas si c'est l'email ou le mot de passe.
            setError('Adresse e-mail ou mot de passe incorrect.');
        } catch {
            setError('Une erreur est survenue. Réessaie plus tard.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Se connecter">
            <form onSubmit={handleSignIn} className={styles.form}>
                <label htmlFor="email" className={styles.label}>Adresse e-mail</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password" className={styles.label}>Mot de passe</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div role="alert" className={styles.error}>{error}</div>}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Connexion…' : 'Se connecter'}
                </button>
            </form>
            <p className={styles.footer}>
                Première visite sur Detflix ?{' '}
                <Link href="/register" className={styles.link}>Inscris-toi</Link>
            </p>
        </AuthLayout>
    );
}

// Un utilisateur déjà connecté n'a rien à faire ici.
export async function getServerSideProps({ req, res, query }) {
    const session = await getServerSession(req, res, authOptions);
    if (session) {
        return { redirect: { destination: safeCallbackUrl(query.callbackUrl), permanent: false } };
    }
    return { props: {} };
}
