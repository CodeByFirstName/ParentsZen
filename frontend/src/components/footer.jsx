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
    <footer className="relative bg-gradient-to-br from-slate-50 to-orange-50/30 text-black pt-16 pb-8">
      {/* Le footer commence ICI, pas de SVG dedans */}
      
      {/* Contenu du footer */}
      <div className="container mx-auto px-6 lg:px-16">
        
        {/* Grid principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Colonne 1 : Logo + Description */}
          <div className="lg:col-span-2">
            <img src="/images/logo_ParentsZen.png" alt="Logo ParentsZen" className="h-14 mb-6" />
            <p className="text-black/60 leading-relaxed mb-6 max-w-md">
              ParentsZen vous accompagne dans votre parcours parental avec des ressources et un soutien adaptés à vos besoins.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-black/60 hover:text-orange-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-orange-400 group-hover:w-4 transition-all duration-300"></span>
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-orange-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-orange-400 group-hover:w-4 transition-all duration-300"></span>
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-orange-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-orange-400 group-hover:w-4 transition-all duration-300"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-orange-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-orange-400 group-hover:w-4 transition-all duration-300"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-black/60 group">
                <MapPin className="text-orange-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={18} />
                <span>Cotonou, Bénin</span>
              </li>
              <li className="flex items-start gap-3 text-black/60 group">
                <Phone className="text-orange-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={18} />
                <a href="tel:+22901970000" className="hover:text-orange-400 transition-colors">
                  (+229) 01 97 00 00
                </a>
              </li>
              <li className="flex items-start gap-3 text-black/60 group">
                <Mail className="text-orange-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={18} />
                <a href="mailto:ParentsZen@gmail.com" className="hover:text-orange-400 transition-colors">
                  ParentsZen@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-black/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/60">
            <p>© 2025 ParentsZen. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-orange-400 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-orange-400 transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;