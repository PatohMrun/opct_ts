"use client"

import React from 'react';

interface HeroButtonProps {
  title: string;
  func: () => void;
}

const HeroButton: React.FC<HeroButtonProps> = ({ title, func }) => {
  return ( 
    <div className="bg-secondary text-black font-bold px-2 py-1 m-2 rounded-md text-lg">
      <button onClick={func} className="">{title}</button>
    </div>
  );
}
 
export default HeroButton;