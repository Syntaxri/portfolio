"use client";
import Layout from '../components/Layout';
import { ModeProvider } from '../context/ModeContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the app in ModeProvider so useMode works */}
        <ModeProvider>
          <Layout>{children}</Layout>
        </ModeProvider>
      </body>
    </html>
  );
}