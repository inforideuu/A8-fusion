import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { solutionsData } from '../data/solutionsData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Boxes, 
  Server, 
  Cpu, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function SolutionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Enterprise Platforms"
        title="Modular Enterprise Software Platforms"
        subtitle="Proprietary software suites designed to govern finances, global supply chains, institutional talent, and sovereign data repositories without third-party vendor lock-in."
        bgImage="/solutions.png"
        breadcrumbs={[
          { label: 'Solutions' }
        ]}
        primaryCtaText="Request Platform Demonstration"
        primaryCtaLink="/request-project"
        secondaryCtaText="Public Sector Solutions"
        secondaryCtaLink="/government"
      />

      {/* Solutions Catalog */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Platform Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              9 Specialized Enterprise Software Platforms
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Each platform can be deployed independently or unified through our distributed event broker to form a comprehensive corporate operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsData.map((sol) => (
              <div
                key={sol.id}
                className="bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-200 card-hover-platform-catalog flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded uppercase">
                      {sol.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {sol.modules.length} Core Modules
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-xs font-serif italic text-slate-600 mt-1">
                      "{sol.tagline}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {sol.shortDesc}
                  </p>

                  {/* Modules Preview Pills */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">
                      Integrated Modules Include:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sol.modules.slice(0, 4).map((mod, i) => (
                        <span key={i} className="text-[10px] font-sans bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {mod.name}
                        </span>
                      ))}
                      {sol.modules.length > 4 && (
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold px-1 py-0.5">
                          +{sol.modules.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-600 font-medium">
                    {sol.status}
                  </span>
                  <Link
                    to={`/solutions/${sol.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Deployment Integrity Statement */}
      <section className="py-16 bg-[#0B172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
            <h3 className="text-2xl font-serif font-normal text-white">
              Transparent Capability &amp; Deployment Disclosures
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              In accordance with our strict corporate governance principles, all software modules and platforms are disclosed accurately as verified enterprise capabilities or planned components tailored during contractual architectural discovery. We never misrepresent static mockups as already-commissioned production deployments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

