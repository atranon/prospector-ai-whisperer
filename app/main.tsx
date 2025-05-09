
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import RootLayout from './layout';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <RootLayout>
        <div className="flex-1">
          {/* Your app content */}
        </div>
      </RootLayout>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
