import { ModeProvider } from '../context/ModeContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ModeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ModeProvider>
  );
}