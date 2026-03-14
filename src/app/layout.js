"use client";
import Layout from '../components/Layout';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap all pages in your global layout */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}