'use client'



import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';

const HeroSection = () => {
  const images = [
    '/PodBanner.png',
    '/PodBanner.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, );

  return (
    <>
<section className='w-full max-w-screen-lg mx-auto my-4 px-4'>
<div className='relative h-0 pb-[50%]'>
  {images.map((image, index) => (
      <NextImage
        key={index}
        src={image}
        className={`absolute inset-0 w-full h-full rounded-2xl transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
        alt={`Banner ${index + 1}`}
        width={3000} height={3000}
      />
    ))}      
  </div>
</section>

    </>
  );
};

export default HeroSection;

