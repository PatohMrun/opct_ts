"use client";

import React from 'react';
import Slider from 'react-slick';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  }

  interface SliderSettings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  nextArrow: React.ReactElement;
  prevArrow: React.ReactElement;
  responsive: {
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
    };
  }[];
  }

const Updates: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className='m-2 px-2  font-poppins'>
        <div className="max-w-4xl p-4 mx-auto my-2">
      <h2 className="text-center text-xl font-bold mb-4">UPDATES</h2>
      <Slider {...settings}>
        <div className="p-4">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-800">
              We are thrilled to announce enhancements to the OPCT program! Enjoy increased benefits tailored to meet your specific needs, ensuring greater financial support for you or your loved ones.
            </p>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-800">
              Get ready for exciting community events with OPCT! Join us for informative workshops and engaging activities designed to empower and connect older persons in our program.
            </p>
          </div>
        </div>
        {/* Add more slides as needed */}
      </Slider>
    </div>
    </section>
  );
};

// interface ArrowProps {
//   className: string;
//   style: React.CSSProperties;
//   onClick: () => void;
// }



const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute right-0 z-10`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      {/* <FaArrowRight className="text-gray-800 text-3xl" /> */}
    </div>
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute left-0 z-10`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      {/* <FaArrowLeft className="text-gray-800 text-3xl" /> */}
    </div>
  );
};

export default Updates;
