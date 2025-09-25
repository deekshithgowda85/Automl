import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './components/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "AutoML Platform - Build, Train, Deploy",
  description: "Advanced automated machine learning platform for developers and data scientists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          footerActionLink: 'text-primary hover:text-primary/90'
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
