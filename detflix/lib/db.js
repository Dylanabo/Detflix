import { Pool } from 'pg';

// Un seul pool partagé, conservé sur globalThis pour survivre au rechargement à chaud en dev.
const globalForDb = globalThis;

export const pool =
    globalForDb.detflixPool ??
    new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'production') {
    globalForDb.detflixPool = pool;
}

export function query(text, params) {
    return pool.query(text, params);
}
