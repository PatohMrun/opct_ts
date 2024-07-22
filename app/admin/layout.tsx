import SideNav from "@/components/admin/sideNav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OPCT | Admin",
  description: "Administrative platform of the OPCT",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-100">
          <SideNav />
          <div className="flex-1 flex flex-col transition-all duration-300 md:ml-16">
            <main className="flex-1 p-6">{children}</main>
            <footer className="p-4 bg-white shadow mt-auto">
              <p className="text-center text-gray-600">© 2024 OPCT Admin. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}