import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  variant = 'dark', // 'dark' (for light backgrounds) or 'light' (for dark backgrounds)
  showTagline = true, 
  size = 'default', // 'sm', 'default', 'lg', 'xl'
  link = true,
  className = ''
}) {
  const isLight = variant === 'light';

  // Responsive image height based on size
  const imgHeightClass = size === 'sm' 
    ? 'h-7 sm:h-8' 
    : size === 'lg' 
    ? 'h-10 sm:h-12' 
    : size === 'xl'
    ? 'h-12 sm:h-16'
    : 'h-8 sm:h-9';

  const logoContent = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Official Corporate Logo Asset */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-white/95 px-2.5 py-1 rounded-xl shadow-sm border border-white/20'
            : ''
        }`}
      >
        <img
          src="/a8logo.png"
          alt="A8Fusion Corporate Logo"
          className={`${imgHeightClass} w-auto object-contain drop-shadow-xs`}
          loading="eager"
        />
      </div>

      {/* Institutional Tagline Pill (Visible on large screens) */}
      {showTagline && (
        <div className="hidden xl:flex flex-col border-l border-slate-200/80 pl-3">
          <span
            className={`text-[9px] font-semibold tracking-[0.2em] uppercase ${
              isLight ? 'text-slate-300' : 'text-slate-700 font-bold'
            }`}
          >
            Made for Global
          </span>
          <span
            className={`text-[8px] font-medium tracking-wider uppercase ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Enterprise Systems
          </span>
        </div>
      )}
    </div>
  );

  if (!link) return logoContent;

  return (
    <Link to="/" aria-label="A8Fusion Corporate Home">
      {logoContent}
    </Link>
  );
}

