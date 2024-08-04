"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { logout } from "../utils/auth";
import Link from "@/components/link-with-loader";
import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import nProgress from "nprogress";
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // opens and closes menu
  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // node initialization
  const menuRef = useRef<HTMLDivElement>(null);

  // Listens to clicks and scrolls outside, or navlink click the menu to close it
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

  const handleLogout = async () => {
    await logout();
    // Redirect to login page or home page
    window.location.href = "/";
  };

  const userDataString = sessionStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <nav className="font-poppins bg-primary flex justify-between items-center gap-8 h-12 z-30">
      {/* OPCT logo */}
      <div className="mx-2 sm:mx-4 flex items-center">
        <Image
          src={"/images/OPCT.png"}
          alt="OPCT Logo"
          width={30}
          height={30}
        />
        <Link href="/" className="text-xs text-white mx-2">
          OPCT
        </Link>
      </div>

      {/* Navlinks */}
      <div className="hidden sm:flex sm:gap-6 text-white">
        <Link
          href="/home"
          className={`hover:text-secondary ${
            pathname === "/home" ? "active" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/messages"
          className={`hover:text-secondary ${
            pathname === "/messages" ? "active" : ""
          }`}
        >
          Messages
        </Link>
        <Link
          href="/profile"
          className={`hover:text-secondary ${
            pathname === "/profile" ? "active" : ""
          }`}
        >
          My Profile
        </Link>
        <Link
          href="/notifications"
          className={`hover:text-secondary ${
            pathname === "/notifications" ? "active" : ""
          }`}
        >
          Notifications
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

      {/* Action buttons*/}
      <div className="flex items-center">
        <div className="flex gap-1 items-center sm:mx-2 ">
          <div className="text-green-200 font-semibold">
            Welcome,{" "}
            {sessionStorage.getItem("userData")
              ? JSON.parse(sessionStorage.getItem("userData")!).firstName
              : "Guest"}
          </div>

          <button
            className="nav-button"
            onClick={async () => {
              nProgress.start();
              await handleLogout();
              router.push("/");
              nProgress.done();
            }}
          >
            Log Out
          </button>
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
        } absolute top-12 left-0 w-full flex-col sm:hidden bg-primary mt-0 pt-4 pb-2 items-center z-10`}
      >
        <div
          ref={menuRef}
          className="flex flex-col text-white w-[95%] bg-darkPrimary items-center rounded-xl"
        >
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/home"
            className={`navlinks ${pathname === "/home" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/messages"
            className={`navlinks ${pathname === "/messages" ? "active" : ""}`}
          >
            Messages
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/profile"
            className={`hover:text-secondary ${
              pathname === "/profile" ? "active" : ""
            }`}
          >
            My Profile
          </Link>
          <Link
            onClick={() => {
              setIsOpen(false);
            }}
            href="/notifications"
            className={`hover:text-secondary ${
              pathname === "/notifications" ? "active" : ""
            }`}
          >
            Notifications
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
