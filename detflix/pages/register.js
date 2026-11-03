import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import AuthLayout from '@/components/AuthLayout';
import { authOptions } from './api/auth/[...nextauth]';
import styles from '@/styles/auth.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setError(data.error ?? 'Une erreur est survenue. Réessaie plus tard.');
                setLoading(false);
                return;
            }

            // Connexion automatique après inscription.
            const result = await signIn('credentials', { email, password, redirect: false });
            await router.replace(result?.ok ? '/' : '/login');
        } catch {
            setError('Une erreur est survenue. Réessaie plus tard.');
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Créer un compte">
            <form onSubmit={handleRegister} className={styles.form}>
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
                <label htmlFor="password" className={styles.label}>Mot de passe (8 caractères minimum)</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirm" className={styles.label}>Confirmer le mot de passe</label>
                <input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={styles.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                {error && <div role="alert" className={styles.error}>{error}</div>}
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Création…' : 'Créer mon compte'}
                </button>
            </form>
            <p className={styles.footer}>
                Déjà inscrit ?{' '}
                <Link href="/login" className={styles.link}>Connecte-toi</Link>
            </p>
        </AuthLayout>
    );
}

export async function getServerSideProps({ req, res }) {
    const session = await getServerSession(req, res, authOptions);
    if (session) {
        return { redirect: { destination: '/', permanent: false } };
    }
    return { props: {} };
}
