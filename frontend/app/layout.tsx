'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingNavDemo } from "@/components/nav-bar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === '/') {
      router.replace('/home');
    }
  }, [router]);
  return (
    <html lang="en">
      <body className={inter.className}>
        <FloatingNavDemo />
          {children}
         </body>
    </html>
  );
}
