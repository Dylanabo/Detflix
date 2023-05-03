import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebase';

import styles from '../styles/login.module.css';
import Image from 'next/image';
import logo from '../public/logo.png';

const auth = getAuth(app);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            console.log('email', email);
            console.log('password', password)
            if (error) setError(null);
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log('user', user);
                });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-page">
            <div className={styles.logoContainer}>
                <Image
                    src={logo}
                    className={styles.logo}
                    alt="Detflix"
                    width={1100}
                    height={600}
                />
            </div>
            <div className="login-form">
                <h1>Se connecter</h1>
                <form onSubmit={handleSignIn}>
                    <input
                        type="email"
                        placeholder="Adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
