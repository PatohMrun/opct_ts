"use client"

import React from 'react';
import Image from "next/image";
import HeroButton from './heroButton';
import { isLoggedIn } from '@/utils/auth';

interface HeroProps {
  photo: string;
  alt: string;
  head: string;
  desc: string;
  buttonName: string;
  onButtonClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ photo, alt, head, desc, buttonName, onButtonClick }) => {
    
    return ( 
        <div className="relative font-poppins">
            <div className="relative min-w-3/4 flex justify-center items-center">
                <Image src={photo} width={1920} height={1080} alt={alt} />
                <div className="absolute inset-0 bg-darkPrimary bg-opacity-60 flex flex-col items-center sm:gap-5  pt-1 justify-center">
                    <h1 className="text-white text-lg sm:text-3xl font-bold text-center">{head}</h1>
                    <p className="text-tertiary text-sm sm:text-xl my-2">{desc}</p>
                    <HeroButton title={buttonName} func={onButtonClick}/>
                </div>
            </div>
        </div>
    );
}
 
export default Hero;