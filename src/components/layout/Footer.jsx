import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { 
  ShieldCheck, 
  Globe2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ArrowUpRight, 
  Lock, 
  FileText, 
  Building2 
} from 'lucide-react';

export default function Footer({ hidePreFooterCard = false }) {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* 
        Upper Executive Engagement Section:
        Surrounding section has a clean, light background (bg-[#F8FAFC]),
        while the card retains its original dark luminous enterprise styling.
      */}
      {!hidePreFooterCard && (
        <section className="bg-[#F8FAFC] border-t border-b border-slate-200 py-12 lg:py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative rounded-2xl p-8 sm:p-10 lg:p-12 bg-gradient-to-r from-[#0E1A38] via-[#162347] to-[#1F1947] border border-indigo-400/40 shadow-2xl shadow-indigo-950/40 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Luminous Ambient Lighting */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/60 text-indigo-300 text-xs font-semibold tracking-wider font-serif">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>International Technology Governance</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-white tracking-tight leading-snug">
                  Ready to architect resilient enterprise systems?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
                  Initiate an executive technical briefing with our principal systems architects and sovereign compliance leads.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-4 flex-shrink-0">
                <Link
                  to="/request-project"
                  className="px-6 py-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Schedule Architecture Review</span>
                  <ArrowUpRight className="w-4 h-4 text-indigo-200" />
                </Link>
                <Link
                  to="/government/enquiry"
                  className="px-6 py-3.5 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg transition-all"
                >
                  Public Sector Tender Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Multi-Column Directory */}
      <footer className="bg-[#030712] text-slate-300 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand & Corporate Overview (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-5">
            <Logo variant="light" size="lg" />
            
            <p className="text-slate-400 text-sm leading-relaxed pr-6 font-sans font-light text-justify">
              A8Fusion is a global enterprise technology and sovereign digital transformation firm. We design, engineer, and operate mission-critical software platforms, private artificial intelligence infrastructure, and digital citizen backbones for multinational organizations and sovereign public institutions.
            </p>



            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://linkedin.com/company/a8fusion" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="A8Fusion on LinkedIn"
              >
                <span className="font-bold text-xs">in</span>
              </a>
              <a 
                href="https://github.com/a8fusion" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="A8Fusion on GitHub"
              >
                <span className="font-bold text-xs">git</span>
              </a>
            </div>

            
          </div>

          {/* Column: Core Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif border-b border-slate-800 pb-2">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services/enterprise-software-development" className="hover:text-white transition-colors">
                  Enterprise Software Dev
                </Link>
              </li>
              <li>
                <Link to="/services/artificial-intelligence" className="hover:text-white transition-colors">
                  AI &amp; Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/services/cloud-infrastructure" className="hover:text-white transition-colors">
                  Cloud &amp; Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/services/cybersecurity" className="hover:text-white transition-colors">
                  Cybersecurity &amp; Zero-Trust
                </Link>
              </li>
              <li>
                <Link to="/services/system-integration" className="hover:text-white transition-colors">
                  System Integration (ESB)
                </Link>
              </li>
              <li>
                <Link to="/services/digital-transformation" className="hover:text-white transition-colors">
                  Digital Transformation
                </Link>
              </li>
              <li>
                <Link to="/services/technology-consulting" className="hover:text-white transition-colors">
                  Technology Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif border-b border-slate-800 pb-2">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/solutions/enterprise-erp" className="hover:text-white transition-colors">
                  Enterprise ERP Suite
                </Link>
              </li>
              <li>
                <Link to="/solutions/enterprise-crm" className="hover:text-white transition-colors">
                  Enterprise CRM
                </Link>
              </li>
              <li>
                <Link to="/solutions/enterprise-hrms" className="hover:text-white transition-colors">
                  HRMS Platform
                </Link>
              </li>
              <li>
                <Link to="/solutions/financial-management" className="hover:text-white transition-colors">
                  Financial Management
                </Link>
              </li>
              <li>
                <Link to="/solutions/business-intelligence" className="hover:text-white transition-colors">
                  Business Intelligence
                </Link>
              </li>
              <li>
                <Link to="/solutions/document-management" className="hover:text-white transition-colors">
                  Document Vault (DMS)
                </Link>
              </li>
              <li>
                <Link to="/solutions/enterprise-ai" className="hover:text-white transition-colors">
                  Enterprise AI Platform
                </Link>
              </li>
              <li>
                <Link to="/solutions/construction-intelligence" className="hover:text-white transition-colors">
                  Construction Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Key Sectors & Gov */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif border-b border-slate-800 pb-2">
              Sectors &amp; Public
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/government" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1">
                  <span>Government &amp; Public Sector</span>
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                </Link>
              </li>
              <li>
                <Link to="/industries/healthcare" className="hover:text-white transition-colors">
                  Healthcare &amp; Life Sciences
                </Link>
              </li>
              <li>
                <Link to="/industries/banking-finance" className="hover:text-white transition-colors">
                  Banking &amp; Financial Services
                </Link>
              </li>
              <li>
                <Link to="/industries/manufacturing" className="hover:text-white transition-colors">
                  Manufacturing &amp; Industry 4.0
                </Link>
              </li>
              <li>
                <Link to="/industries/logistics" className="hover:text-white transition-colors">
                  Logistics &amp; Transportation
                </Link>
              </li>
              <li>
                <Link to="/industries/energy-utilities" className="hover:text-white transition-colors">
                  Energy &amp; Public Utilities
                </Link>
              </li>
              <li>
                <Link to="/global-business" className="hover:text-white transition-colors">
                  Global Business Alliances
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Corporate & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif border-b border-slate-800 pb-2">
              Corporate
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/company/about" className="hover:text-white transition-colors">
                  About A8Fusion
                </Link>
              </li>
              <li>
                <Link to="/company/leadership" className="hover:text-white transition-colors">
                  Executive Leadership
                </Link>
              </li>
              <li>
                <Link to="/company/our-approach" className="hover:text-white transition-colors">
                  Engineering Governance
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers &amp; Engineering Roles
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-white transition-colors">
                  Insights &amp; Whitepapers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Corporate Office
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="hover:text-white transition-colors">
                  Strategic Systems Partnerships
                </Link>
              </li>
              <li className="pt-1.5">
                <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] transition-colors inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin Portal // Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance, Legal & Copyright Strip */}
      <div className="border-t border-slate-800/80 bg-[#050A13] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span>&copy; {currentYear} A8Fusion International. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400">
              Tagline: <span className="text-slate-200 font-medium">Made for Global.</span>
            </span>
          </div>

          {/* Zenelait Infotech Powered By Emblem */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-slate-400 font-sans">Powered by</span>
            <a
              href="https://zenelaitinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center group transition-transform hover:scale-105 cursor-pointer"
              title="Zenelait Infotech - https://zenelaitinfotech.com/"
            >
              <img
                src="/zenelaitinfotech_logo.png"
                alt="Zenelait Infotech Logo"
                className="h-6 sm:h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-xs"
              />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Terms of Engagement
            </Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Sovereign Data Governance
            </Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Cookie Preferences
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
