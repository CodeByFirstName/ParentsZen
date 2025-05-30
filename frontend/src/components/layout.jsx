import React from 'react';
import Footer from '../components/footer';

const Layout = () => {
  return (
    <div className="relative">
      {/* Footer avec padding top pour que le SVG puisse s'y poser */}
      <div className="relative pt-20">
        {/* SVG vague absolument positionnée */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg
            className="w-full h-32 sm:h-48 md:h-64 lg:h-72"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,160 C120,280 240,40 360,160 C480,280 600,40 720,160 C840,280 960,40 1080,160 C1200,280 1320,40 1440,160 L1440,320 L0,320 Z"
              fill="#FFE7CF"
            />
          </svg>
        </div>

        {/* Footer collé juste sous la vague */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
