import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faro Shuffle Visualization",
  description: "Interactive visualization of the Faro shuffle card shuffling technique",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
