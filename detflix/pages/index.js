import Image from 'next/image'
import { Inter } from 'next/font/google'
import withAuth from '../firebase/auth'
const inter = Inter({ subsets: ['latin'] })

function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex flex-col items-center justify-center">
        <h1>Detflix</h1>
        <p>Detflix is a Netflix clone built with Next.js and Firebase.</p>
        <p>It is a work in progress.</p>
      </div>
    </main>
  )
}

export default withAuth(Home);
