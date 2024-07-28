"use client";

import { isLoggedIn } from "@/utils/auth";
import React from "react";
import Link from "./link-with-loader";

interface HeroButtonProps {
  title: string;
  func: () => void;
}

const HeroButton: React.FC<HeroButtonProps> = ({ title, func }) => {
  if (isLoggedIn()) {
    <div>
      <Link
        href={"/home"}
        className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 mx-auto my-2  border flex items-center gap-2"
      >
        <span>Go Home </span>
        <span>&rarr;</span>
      </Link>
    </div>;
  }
  return (
    <div>
      <button
        onClick={func}
        className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 mx-auto my-2  border flex items-center gap-2"
      >
        <span>{title} </span>
        <span>&rarr;</span>
      </button>
    </div>
  );
};

export default HeroButton;
