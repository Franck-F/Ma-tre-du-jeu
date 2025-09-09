import '../styles/globals.css';
import { Cinzel, Lato } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cinzel',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

function MyApp({ Component, pageProps }) {
  return (
    <main className={`${cinzel.variable} ${lato.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
