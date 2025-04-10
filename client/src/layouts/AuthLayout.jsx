"use client";

import { useState, useEffect } from "react";

const AuthLayout = ({ children, title, subtitle, showImageSlider = true }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/AppointmentPhoto.png",
    "/DoctorsPhoto.png",
    "/NursePhoto.png",
    "/HeartPulsePhoto.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-row">
      {/* Left Side - Image Slider */}
      {showImageSlider && (
        <div className="w-1/2 bg-white flex justify-center items-center relative h-screen overflow-hidden">
          <div className="flex flex-col justify-center items-center gap-5">
            {/* Image Slider Container */}
            <div className="relative h-[50vh] w-[50vh]">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img || "/placeholder.svg"}
                  alt="Slider"
                  className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                    currentImage === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Tagline */}
            <h1 className="text-blue-600 text-3xl font-semibold text-center">
              Smart Access to Healthcare
            </h1>
          </div>
        </div>
      )}

      {/* Right Side - Content */}
      <div
        className={`${
          showImageSlider ? "w-1/2" : "w-full"
        } bg-blue-600 flex items-center justify-center p-4`}>
        <div className="w-full max-w-md">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold text-center">{title}</h2>
            <p className="text-center text-blue-100">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
