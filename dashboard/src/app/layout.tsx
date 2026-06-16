import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/dashboard/ui/SessionProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El Refugio - Admin",
  description: "Panel de administración",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}