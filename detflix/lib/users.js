import bcrypt from 'bcryptjs';
import { query } from './db';

const BCRYPT_COST = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hash factice comparé quand l'email est inconnu, pour que le temps de réponse
// ne révèle pas si un compte existe.
const DUMMY_HASH = bcrypt.hashSync('detflix-dummy-password', BCRYPT_COST);

export function normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

// Renvoie un message d'erreur en français, ou null si les identifiants sont valides.
export function validateCredentials(email, password) {
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
        return 'Adresse e-mail invalide.';
    }
    if (typeof password !== 'string' || password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    // bcrypt ignore tout ce qui dépasse 72 octets.
    if (Buffer.byteLength(password, 'utf8') > 72) {
        return 'Le mot de passe est trop long (72 octets maximum).';
    }
    return null;
}

export async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const { rows } = await query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING
         RETURNING id, email`,
        [email, passwordHash],
    );
    return rows[0] ?? null; // null => email déjà utilisé
}

// Renvoie { id, email } si les identifiants sont corrects, sinon null.
export async function verifyCredentials(rawEmail, password) {
    const email = normalizeEmail(rawEmail);
    if (!email || typeof password !== 'string') return null;

    const { rows } = await query(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [email],
    );
    const user = rows[0];
    const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
    return user && ok ? { id: user.id, email: user.email } : null;
}
