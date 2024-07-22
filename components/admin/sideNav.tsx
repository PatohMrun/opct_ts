"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFolder, FiSearch, FiSettings, FiMenu } from 'react-icons/fi';

const SideNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: FiHome, name: 'Home', path: '/admin' },
    { icon: FiFolder, name: 'Projects', path: '/projects' },
    { icon: FiSearch, name: 'Search', path: '/search' },
    { icon: FiSettings, name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className={`fixed left-0 top-0 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-56 md:relative' : 'w-12 relative'} `}>
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
            <Link href={item.path} 
                  className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                    pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}>
              <item.icon className="text-xl" />
              {isExpanded && (
                <span className="ml-4 transition-opacity duration-200">{item.name}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;