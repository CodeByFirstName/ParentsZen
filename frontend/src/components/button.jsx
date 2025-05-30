// src/components/button.jsx
import React from 'react';
import { colors, font } from '../styles/designSystem';
import clsx from 'clsx';

const Button = ({
  children,
   
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}) => {
  const baseStyle = `
    rounded-full 
    font-semibold 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    transition-transform transition-colors transition-shadow 
    duration-300 
    ease-in-out
    shadow-sm
  `;

  const variants = {
    primary: `text-white focus:ring-orange-300`,
    secondary: `text-${colors.textDark} focus:ring-blue-300`,
    outline: `border-2 focus:ring-orange-300`,
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-6 py-3',
  };

  const baseColor = variant === 'primary' ? colors.primary 
                   : variant === 'secondary' ? colors.softBlue 
                   : 'transparent';

  const textColor = variant === 'outline' ? colors.primary 
                  : variant === 'secondary' ? colors.textDark 
                  : 'white';

  // Couleurs hover plus contrastées
  const hoverBackground = variant === 'primary' ? '#cc4d00'  // orange foncé plus visible
                        : variant === 'secondary' ? '#7db1ff' // bleu un peu plus foncé
                        : 'rgba(255, 165, 0, 0.2)';          // outline avec fond léger plus visible

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        fontFamily: font.family,
        backgroundColor: baseColor,
        color: textColor,
        borderColor: variant === 'outline' ? colors.primary : undefined,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
      }}
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full'
      )}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = hoverBackground;
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = baseColor;
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
