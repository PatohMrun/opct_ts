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
        <div className="flex min-h-screen">
          <div className="fixed">
            <SideNav />
          </div>
          <section className="flex flex-col flex-1 transition-all duration-300 ease-in-out">
            <div className="min-h-[80vh] pl-14 pr-6">{children}</div>
            <footer className="p-4 w-[100%] shadow mt-auto">
              <p className="text-center text-gray-600">© 2024 OPCT Admin. All rights reserved.</p>
            </footer>
          </section>
        </div>
      </body>
    </html>
  );
}