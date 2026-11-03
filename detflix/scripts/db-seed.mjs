// Crée (ou met à jour) un compte de test à partir de SEED_USER_EMAIL / SEED_USER_PASSWORD.
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { DATABASE_URL, SEED_USER_EMAIL, SEED_USER_PASSWORD } = process.env;

if (!DATABASE_URL || !SEED_USER_EMAIL || !SEED_USER_PASSWORD) {
    console.error('DATABASE_URL, SEED_USER_EMAIL et SEED_USER_PASSWORD sont requis (voir .env.example).');
    process.exit(1);
}
if (SEED_USER_PASSWORD.length < 8) {
    console.error('SEED_USER_PASSWORD doit contenir au moins 8 caractères.');
    process.exit(1);
}

const email = SEED_USER_EMAIL.trim().toLowerCase();
const passwordHash = await bcrypt.hash(SEED_USER_PASSWORD, 12);
const client = new pg.Client({ connectionString: DATABASE_URL });

try {
    await client.connect();
    await client.query(
        `INSERT INTO users (email, password_hash) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [email, passwordHash],
    );
    console.log(`Compte de test prêt : ${email}`);
} finally {
    await client.end();
}
