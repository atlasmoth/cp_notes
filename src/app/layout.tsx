import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./hooks/useAuth";

export const metadata: Metadata = {
  title: "Notes App",
  description: "Create personal notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased linear-gradient`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
