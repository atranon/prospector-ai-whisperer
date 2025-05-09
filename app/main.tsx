
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import RootLayout from './layout';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <AuthProvider>
        <RootLayout>
          <div className="flex-1">
            {/* Your app content */}
          </div>
        </RootLayout>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
