import { createUser, normalizeEmail, validateCredentials } from '@/lib/users';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Méthode non autorisée.' });
    }

    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    const validationError = validateCredentials(email, password);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const user = await createUser(email, password);
        if (!user) {
            return res.status(409).json({ error: 'Un compte existe déjà avec cette adresse e-mail.' });
        }
        return res.status(201).json({ ok: true });
    } catch (err) {
        console.error('Erreur lors de l\'inscription :', err.message);
        return res.status(500).json({ error: 'Une erreur est survenue. Réessaie plus tard.' });
    }
}
