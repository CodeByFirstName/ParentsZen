// src/components/Container.jsx
import React from 'react';

const Container = ({ children }) => {
  return (
    <div
      className="
        max-w-4xl
        mx-auto
        px-8 md:px-16
        py-12 md:py-16
        rounded-3xl
        border border-white/30
        bg-gradient-to-br from-white/40 via-white/30 to-white/10
        backdrop-blur-xl
        shadow-lg
        transition-transform
        duration-500
        ease-in-out
        hover:shadow-2xl
        hover:scale-[1.02]
        "
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {children}
    </div>
  );
};

export default Container;
