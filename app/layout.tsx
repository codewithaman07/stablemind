import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from './context/ThemeContext';
import "./globals.css";

export const metadata: Metadata = {
  title: "StableMind - Your Mental Health Companion",
  description: "Navigate placement season with confidence. StableMind provides mental health support, wellness tools, and community for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
