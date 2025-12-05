import React, { useState, useEffect } from "react";
const IMAGE_BASE_URL = "http://localhost:8080/api/image";

const ProductImageCarousel = ({ images = [], activeImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!activeImage) return;
    const index = images.findIndex((img) => img === activeImage);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (index !== -1) setCurrentIndex(index);
  }, [activeImage, images]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-100">
      {/* SLIDE TRACK */}
      <div
        className="flex transition-transform duration-700 ease-in-out w-full h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`${IMAGE_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`}
            alt={`slide-${idx}`}
            className="w-full h-full object-contain flex-shrink-0"
          />
        ))}
      </div>

      {/* PREV */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-black transition z-10"
      >
        ‹
      </button>

      {/* NEXT */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-black transition z-10"
      >
        ›
      </button>
    </div>
  );
};

export default ProductImageCarousel;
