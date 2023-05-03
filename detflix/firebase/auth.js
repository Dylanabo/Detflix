import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from './firebase';

const withAuth = (Component) => {
    const WithAuthComponent = (props) => {
        const router = useRouter();
        const auth = getAuth(firebase);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    router.push('/login');
                }
            });

            // Nettoyez l'abonnement lors du démontage du composant
            return () => {
                unsubscribe();
            };
        }, []);

        return <Component {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
