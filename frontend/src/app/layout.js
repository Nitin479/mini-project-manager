'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { loadFromStorage } from '@/store/authSlice';
import { ThemeProvider } from '@/components/ThemeContext';
import './globals.css';

function AuthLoader({ children }) {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);
  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Mini Project Manager</title>
        <meta name="description" content="A fullstack Project Management web app built with Next.js, Redux Toolkit, Express, MongoDB, and Three.js" />
      </head>
      <body className="bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-gray-100 antialiased selection:bg-indigo-500/30 selection:text-white min-h-screen transition-colors duration-300">
        <Provider store={store}>
          <ThemeProvider>
            <AuthLoader>
              {children}
            </AuthLoader>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
