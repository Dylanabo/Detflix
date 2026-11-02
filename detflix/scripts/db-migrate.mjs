// Applique db/schema.sql sur la base pointée par DATABASE_URL.
import { readFile } from 'node:fs/promises';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL manquant (voir .env.example).');
    process.exit(1);
}

const sql = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
    await client.connect();
    await client.query(sql);
    console.log('Schéma appliqué.');
} finally {
    await client.end();
}
