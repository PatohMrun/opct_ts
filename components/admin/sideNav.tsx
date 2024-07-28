"use client";

import React, { useState } from "react";
import Link from "@/components/link-with-loader";
import { redirect, usePathname, useRouter } from "next/navigation";
import { AiOutlineDashboard, AiOutlineLogout } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { CiViewList } from "react-icons/ci";
import { LuMessageSquare } from "react-icons/lu";
import { Download } from "lucide-react";
import { logout } from "@/utils/auth";
import nProgress from "nprogress";

const SideNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: AiOutlineDashboard, name: "Dashboard", path: "/admin" },
    { icon: CiViewList, name: "Announcements", path: "/admin/announcements" },
    { icon: LuMessageSquare, name: "Messages", path: "/admin/messages" },
    // export
    {
      name: "Export Data",
      path: "/admin/export",
      icon: Download,
    },
  ];

  const handleLogout = async () => {
    // Implement your logout logic here
    nProgress.start();
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav
      className={`fixed z-50 left-0 top-0 h-[100vh] bg-primary text-white transition-all duration-300 ease-in-out ${
        isExpanded ? "w-56" : "w-12"
      } md:relative`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>
      </div>
      <ul className="mt-8 space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                pathname === item.path ? "bg-blue-950" : "hover:bg-blue-900"
              }`}
            >
              <item.icon className="text-xl" />
              {isExpanded && (
                <span className="ml-4 transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center px-4 py-2 transition-colors duration-200 hover:bg-blue-900`}
          >
            <AiOutlineLogout className="text-xl" />
            {isExpanded && (
              <span className="ml-4 transition-opacity duration-200">
                Log Out
              </span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
