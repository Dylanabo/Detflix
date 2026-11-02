import Image from 'next/image';
import Head from 'next/head';
import logo from '@/public/logo.png';
import banner from '@/public/banner.jpg';
import styles from '@/styles/auth.module.css';

export default function AuthLayout({ title, children }) {
    return (
        <>
            <Head>
                <title>{`${title} – Detflix`}</title>
            </Head>
            <div className={styles.page}>
                <Image
                    src={banner}
                    alt=""
                    fill
                    priority
                    placeholder="blur"
                    className={styles.banner}
                />
                <header className={styles.header}>
                    <Image src={logo} alt="Detflix" className={styles.logo} priority />
                </header>
                <main className={styles.card}>
                    <h1 className={styles.title}>{title}</h1>
                    {children}
                </main>
            </div>
        </>
    );
}
