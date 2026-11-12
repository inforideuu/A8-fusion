import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import IndustryTopologyVisualizer from '../components/common/IndustryTopologyVisualizer';
import { industriesData } from '../data/industriesData';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Cpu, 
  Workflow, 
  BarChart3, 
  Boxes,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export default function IndustryDetailPage() {
  const { slug } = useParams();

  // If user requests /industries/government, redirect to the premier sovereign page
  if (slug === 'government') {
    return <Navigate to="/government" replace />;
  }

  const industry = industriesData.find(ind => ind.slug === slug);

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const relatedSolutions = solutionsData.slice(0, 3);

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Sector Technology Suite"
        title={industry.title}
        subtitle={industry.tagline}
        bgImage="/industries.png"
        breadcrumbs={[
          { label: 'Industries', link: '/industries' },
          { label: industry.title }
        ]}
        primaryCtaText="Discuss Industry Scope"
        primaryCtaLink={`/request-project?industry=${industry.slug}`}
        secondaryCtaText="All Industries Catalog"
        secondaryCtaLink="/industries"
      />

      {/* 1. Industry Introduction & Responsive Architecture Flow */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Sector Foundations & Deployments */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  Sector Foundations
                </span>
                <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                  Architectural Resilience Tailored for {industry.title}
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                
                <p className="text-sm text-slate-600 font-sans leading-relaxed pt-1">
                  {industry.overview}
                </p>
              </div>

              {/* Verified Real-World Deployments */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Verified Real-World Deployments &amp; Scenarios
                </h4>
                <div className="space-y-2">
                  {industry.useCases.map((uc, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 card-hover-deployment-row">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Responsive Creative Diagram Tailored to Current Industry */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <IndustryTopologyVisualizer industry={industry} />
            </div>
          </div>

          {/* Sector Operational Roadblocks We Resolve */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider font-mono mb-4">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Sector Operational Roadblocks We Resolve</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {industry.challenges.map((ch, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-roadblock">
                  <div className="text-[11px] font-mono font-bold text-rose-600">VULNERABILITY 0{i + 1}</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{ch}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Relevant Technology Solutions & Platforms */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Engineering Blueprints
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Technology Solutions &amp; Software Platforms
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Deploy modular applications engineered to integrate directly into active operational environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.solutions.map((sol, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-sector-solution">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold text-xs">
                  0{i + 1}
                </div>
                <h4 className="text-base font-serif font-bold text-slate-900">{sol}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Tailored integration supporting local regulatory mandates, automated audit logs, and multi-tenant department security boundaries.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5, 6, 7. Automation, Data Analytics & Integration */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Automation Opportunities */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 card-hover-sector-automation">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono uppercase tracking-wider">
                <Workflow className="w-4 h-4" />
                <span>Enterprise Automation</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Intelligent Process Automation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {industry.automation}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Human-in-the-loop exception handling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Immutable audit trail of every automated execution</li>
              </ul>
            </div>

            {/* Analytics & Data Telemetry */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 card-hover-sector-analytics">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>Executive Telemetry</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                Data &amp; Predictive Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {industry.analytics}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Real-time sub-second query streaming</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Fine-grained row and column level authorization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-normal text-slate-900">
            Request an Industry Technical Evaluation for {industry.title}
          </h2>
          <p className="text-sm text-slate-600 font-sans max-w-xl mx-auto leading-relaxed">
            Connect with our sector principal architects to analyze compliance readiness, data migration strategies, and platform integration.
          </p>
          <div className="pt-2">
            <Link
              to={`/request-project?industry=${industry.slug}`}
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Initiate Sector Architecture Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

