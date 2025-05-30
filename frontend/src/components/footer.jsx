import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#D1FAE5] text-black pt-20 pb-10 mt-20">

      {/* Vague SVG en haut */}
      <div className="w-full overflow-hidden -mt-20">
        <svg
          className="w-full h-20 md:h-32"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#D1FAE5"
            d="M0,128L80,138.7C160,149,320,171,480,165.3C640,160,800,128,960,117.3C1120,107,1280,117,1360,122.7L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      {/* Contenu du footer */}
      <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Colonne 1 : Logo + contact */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <img src="/images/logo_ParentsZen.png" alt="Logo" className="h-12 mb-4" />

          <p className="flex items-center gap-2 text-black/60">
            <MapPin className="text-orange-400" size={18} /> Cotonou
          </p>
          <p className="flex items-center gap-2 text-black/60">
            <Phone className="text-orange-400" size={18} /> (+229) 01 97 00 00
          </p>
          <p className="flex items-center gap-2 text-black/60">
            <Mail className="text-orange-400" size={18} /> ParentsZen@gmail.com
          </p>

          <div className="flex gap-4 mt-4">
            <a href="#"><Twitter className="hover:text-orange-400 cursor-pointer" /></a>
            <a href="#"><Facebook className="hover:text-orange-400 cursor-pointer" /></a>
            <a href="#"><Instagram className="hover:text-orange-400 cursor-pointer" /></a>
          </div>
        </div>

        {/* Colonne 2 : Liens utiles */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4">Liens utiles</h3>
          <ul className="space-y-2 text-black/60">
            <li><a href="#" className="hover:text-orange-400 transition-colors">À propos</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Explorer */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4">Explorer</h3>
          <ul className="space-y-2 text-black/60">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Mentions légales</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
