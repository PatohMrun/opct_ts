"use client";

import React, { useEffect, useState } from "react";

type Announcement = {
  id: number;
  title: string;
  content: string;
};

const Updates: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements");
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === announcements.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? announcements.length - 1 : prevSlide - 1
    );
  };

  return (
    <section className="m-2 px-2 font-poppins">
      <div className="max-w-4xl p-4 mx-auto my-2">
        <h2 className="text-center text-xl font-bold mb-4">UPDATES</h2>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {announcements.map((announcement) => (
                <div key={announcement.id} className="min-w-full p-4">
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-800">{announcement.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2"
              onClick={prevSlide}
            >
              &#10094;
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2"
              onClick={nextSlide}
            >
              &#10095;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Updates;
