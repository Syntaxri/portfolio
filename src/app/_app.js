import Head from 'next/head';
import { ModeProvider } from '../context/ModeContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* ── Primary favicon ── */}
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="icon" href="favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Browser / OS chrome ── */}
        <meta name="theme-color" content="#ff8c42" />
        <meta name="msapplication-TileColor" content="#050a14" />

        {/* ── Default meta (pages override with their own <Head>) ── */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Akram Rihani" />
      </Head>

      <ModeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ModeProvider>
    </>
  );
}