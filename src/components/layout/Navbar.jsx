import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Building2, 
  Layers, 
  Cpu, 
  FileCheck2, 
  Briefcase, 
  PhoneCall,
  Search,
  Lock,
  Handshake
} from 'lucide-react';
import { navigationLinks } from '../../data/navigationData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

  // Monitor scroll for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileSubmenu(null);
  }, [location.pathname]);

  // Lock body scroll on mobile when menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (title) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const isLiveEdit = location.search.includes('live_edit=true');

  return (
    <>
      {/* Top Sovereign Institutional Bar */}
      <div className={`bg-[#070D18] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800/80 hidden md:block ${isLiveEdit ? 'mt-11' : ''}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex items-center justify-between tracking-wide">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sovereign &amp; Enterprise Systems Operational
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              International Delivery Hubs: <span className="text-slate-200 font-medium">Singapore · UAE · United Kingdom</span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <Link to="/partnerships" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5 text-indigo-400" />
              <span>Partnerships</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/government" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sovereign Enquiries</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>Admin Portal</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-400">
              ISO/IEC 27001 Aligned Frameworks
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className={`sticky ${isLiveEdit ? 'top-11' : 'top-0'} z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90 py-3' 
          : 'bg-white border-b border-slate-100 py-4'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo variant="dark" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" onMouseLeave={handleMouseLeave}>
              {navigationLinks.map((link) => {
                const hasChildren = link.children && link.children.length > 0;
                const isCurrent = location.pathname.startsWith(link.href) && link.href !== '/';
                const isOpen = activeDropdown === link.title;

                if (!hasChildren) {
                  return (
                    <Link
                      key={link.title}
                      to={link.href}
                      className={`px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-semibold tracking-normal rounded-md transition-colors ${
                        isCurrent
                          ? 'text-indigo-600 bg-slate-50'
                          : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80'
                      }`}
                    >
                      {link.title}
                    </Link>
                  );
                }

                return (
                  <div
                    key={link.title}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(link.title)}
                  >
                    <button
                      type="button"
                      className={`px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-semibold tracking-normal rounded-md inline-flex items-center gap-1 transition-colors ${
                        isOpen || isCurrent
                          ? 'text-indigo-600 bg-slate-50'
                          : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80'
                      }`}
                    >
                      <span>{link.title}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                      }`} />
                    </button>

                    {/* Mega Dropdown Menu */}
                    {isOpen && (
                      <div className={`absolute top-full left-0 mt-1.5 rounded-xl shadow-2xl bg-white border border-slate-200 p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                        link.title === 'Solutions' || link.title === 'Industries' ? 'w-[780px] -left-20' : 'w-[520px]'
                      }`}>
                        {/* Dropdown Header Description */}
                        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase font-serif">
                              {link.title} Directory
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">{link.description}</p>
                          </div>
                          <Link 
                            to={link.href} 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
                          >
                            <span>Explore Overview</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>

                        {/* Grid of Sub-links */}
                        <div className={`grid gap-3 ${
                          link.title === 'Solutions' || link.title === 'Industries' 
                            ? 'grid-cols-2' 
                            : 'grid-cols-1'
                        }`}>
                          {link.children.map((child) => (
                            <Link
                              key={child.title}
                              to={child.href}
                              className="group block p-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {child.title}
                                </h4>
                                <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {child.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Primary Action CTA */}
            <div className="hidden lg:flex items-center flex-shrink-0 ml-auto">
              <Link
                to="/request-project"
                className="relative inline-flex items-center justify-center px-4 xl:px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all bg-[#0B172A] hover:bg-indigo-900 rounded-lg shadow-sm hover:shadow-indigo-900/20 active:scale-[0.99] group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-indigo-400" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center space-x-2 ml-auto">
              <Link
                to="/request-project"
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0B172A] rounded-md sm:hidden"
              >
                Discuss
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl max-h-[85vh] overflow-y-auto px-4 py-6">
            <div className="space-y-2">
              {navigationLinks.map((link) => {
                const hasChildren = link.children && link.children.length > 0;
                const isSubmenuOpen = mobileSubmenu === link.title;

                if (!hasChildren) {
                  return (
                    <Link
                      key={link.title}
                      to={link.href}
                      className="block px-3 py-2.5 text-sm font-bold text-slate-800 hover:text-indigo-600 rounded-lg hover:bg-slate-50"
                    >
                      {link.title}
                    </Link>
                  );
                }

                return (
                  <div key={link.title} className="border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      onClick={() => setMobileSubmenu(isSubmenuOpen ? null : link.title)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-slate-800 hover:text-indigo-600"
                    >
                      <span>{link.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isSubmenuOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                    </button>

                    {isSubmenuOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-2 bg-slate-50/70 rounded-lg my-1">
                        <Link
                          to={link.href}
                          className="block text-xs font-bold text-indigo-600 uppercase tracking-wider py-1 border-b border-slate-200 pb-1"
                        >
                          All {link.title} Overview &rarr;
                        </Link>
                        {link.children.map((child) => (
                          <Link
                            key={child.title}
                            to={child.href}
                            className="block py-1.5 text-xs text-slate-700 hover:text-indigo-600 font-medium"
                          >
                            <div className="font-semibold text-slate-900">{child.title}</div>
                            <div className="text-[10px] text-slate-500 truncate">{child.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <Link
                to="/request-project"
                className="block w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#0B172A] rounded-lg shadow"
              >
                Discuss Your Project
              </Link>
              <Link
                to="/government/enquiry"
                className="block w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg"
              >
                Government Tender Enquiry
              </Link>
              <Link
                to="/admin"
                className="block w-full py-2.5 text-center text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 bg-[#0B132B] border border-indigo-900/60 rounded-lg"
              >
                Institutional Admin Console
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

