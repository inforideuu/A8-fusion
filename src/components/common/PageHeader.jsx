import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PageHeader({
  badge = 'Enterprise Technology',
  title,
  subtitle,
  breadcrumbs = [],
  primaryCtaText = 'Discuss Your Project',
  primaryCtaLink = '/request-project',
  secondaryCtaText,
  secondaryCtaLink,
  align = 'left', // 'left' or 'center'
  bgImage
}) {
  return (
    <section className={`relative bg-[#070D18] text-white overflow-hidden border-b border-slate-800 flex items-center ${
      bgImage 
        ? 'min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] py-16 sm:py-20 lg:py-24' 
        : 'py-16 sm:py-20 lg:py-24'
    }`}>
      {/* Background Hero Image (if provided) */}
      {bgImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <img
            src={bgImage}
            alt={`${title || 'A8Fusion Enterprise'} Architecture Header`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Background Architectural Grid & Subtle Radial Glow (default when no bgImage) */}
      {!bgImage && (
        <>
          <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-40"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-mono">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label || idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {crumb.link ? (
                <Link to={crumb.link} className="hover:text-white transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-indigo-400 font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Eyebrow Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-5 shadow-lg`}>
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{badge}</span>
        </div>

        {/* Title & Subtitle with Times New Roman */}
        <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-4xl'}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-slate-100 font-sans font-normal leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              {subtitle}
            </p>
          )}

          {/* Action Row */}
          {(primaryCtaText || secondaryCtaText) && (
            <div className={`mt-8 flex flex-wrap items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
              {primaryCtaText && (
                <Link
                  to={primaryCtaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200" />
                </Link>
              )}

              {secondaryCtaText && secondaryCtaLink && (
                <Link
                  to={secondaryCtaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
