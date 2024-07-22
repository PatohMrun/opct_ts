import NavRender from "@/components/navRenderer";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OPCT | Main",
  description: "Main platform of the OPCT",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavRender />
        {children}
        <Footer />
        </body>
    </html>
  );
}
