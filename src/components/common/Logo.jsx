import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  variant = 'dark', // 'dark' (for light backgrounds) or 'light' (for dark navy backgrounds)
  showTagline = true, 
  size = 'default', // 'sm', 'default', 'lg'
  link = true 
}) {
  const isLight = variant === 'light';

  const logoContent = (
    <div className="flex items-center gap-3 group select-none">
      {/* Precision Geometric SVG Emblem */}
      <div className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      }`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Base Hexagonal Shield */}
          <rect x="2" y="2" width="44" height="44" rx="10" 
            fill={isLight ? '#0F172A' : '#0B172A'} 
            stroke={isLight ? 'rgba(255,255,255,0.15)' : 'rgba(11,23,42,0.12)'} 
            strokeWidth="1.5"
          />
          {/* Architectural 'A' & Infinity '8' Fusion Vector */}
          <path 
            d="M14 34L24 12L34 34H28.5L24 23.5L19.5 34H14Z" 
            fill="url(#logo_grad_blue)" 
          />
          {/* Fusion Cross Bridge */}
          <path 
            d="M19 25.5H29" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          {/* Sovereign Purple Fusion Core Node */}
          <circle cx="34" cy="14" r="4" fill="url(#logo_grad_purple)" />
          <circle cx="34" cy="14" r="1.5" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="logo_grad_blue" x1="14" y1="12" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="logo_grad_purple" x1="30" y1="10" x2="38" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typographic Identity */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight">
          <span className={`font-serif font-black tracking-wider ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${isLight ? 'text-white' : 'text-[#0B172A]'}`}>
            A8
          </span>
          <span className={`font-serif font-bold tracking-widest uppercase ml-0.5 ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${isLight ? 'text-indigo-400' : 'text-indigo-600'}`}>
            FUSION
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] font-semibold tracking-[0.2em] uppercase ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Made for Global
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
            <span className={`text-[8.5px] font-medium tracking-wider uppercase hidden sm:inline ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Enterprise
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (!link) return logoContent;

  return (
    <Link to="/" aria-label="A8Fusion Home">
      {logoContent}
    </Link>
  );
}

