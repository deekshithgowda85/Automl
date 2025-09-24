import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './components/providers/theme-provider';

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
  );
}
