"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoMenu, IoClose } from "react-icons/io5";
import Link from "@/components/link-with-loader";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Opens and closes menu
  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Node initialization
  const menuRef = useRef<HTMLDivElement>(null);

  // Listens to clicks and scrolls outside, or navlink click to close the menu
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      isOpen &&
      menuRef.current &&
      !menuRef.current.contains((e.target as Node) || null)
    ) {
      setIsOpen(false);
    }
  };

  const handleScroll = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <nav className="font-poppins bg-primary flex justify-between items-center gap-8 h-12 relative w-full z-30">
      {/* OPCT logo */}
      <div className="mx-2 sm:mx-4 flex items-center">
        <Link href="/">
          <Image
            src={"/images/OPCT.png"}
            alt="OPCT Logo"
            width={30}
            height={30}
          />
        </Link>
        <Link href="/" className="text-xs text-white mx-2">
          OPCT
        </Link>
      </div>

      {/* Navlinks */}
      <div className="hidden sm:flex sm:gap-6 text-white">
        <Link
          href="/"
          className={`hover:text-secondary ${pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`hover:text-secondary ${
            pathname === "/about" ? "active" : ""
          }`}
        >
          About
        </Link>
        <Link
          href="/faqs"
          className={`hover:text-secondary ${
            pathname === "/faqs" ? "active" : ""
          }`}
        >
          FAQs
        </Link>
      </div>

      {/* Action buttons */}
      <div className="flex items-center">
        <div className="flex gap-1 sm:mx-2">
          <Link
            href={"/login"}
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 mx-auto my-2 "
          >
            Log&nbsp;in
          </Link>
          <Link
            href={"/register"}
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 mx-auto my-2 "
          >
            Register
          </Link>
        </div>

        {/* Mobile menu toggle icon */}
        <div className="sm:hidden ml-2 mr-2">
          {isOpen ? (
            <IoClose
              className="text-secondary text-3xl"
              onClick={handleToggleMenu}
            />
          ) : (
            <IoMenu
              className="text-secondary text-3xl"
              onClick={handleToggleMenu}
            />
          )}
        </div>
      </div>

      {/* Navlinks mobile */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute top-12 left-0 w-full flex-col sm:hidden bg-primary mt-0 pt-4 pb-2 items-center `}
      >
        <div
          ref={menuRef}
          className="flex flex-col text-white w-[95%] bg-darkPrimary items-center rounded-xl"
        >
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/"
            className={`navlinks ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/about"
            className={`navlinks ${pathname === "/about" ? "active" : ""}`}
          >
            About
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/faqs"
            className={`navlinks ${pathname === "/faqs" ? "active" : ""}`}
          >
            FAQs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
